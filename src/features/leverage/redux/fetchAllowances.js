import { useCallback } from 'react';
import { erc20ABI } from "../../configure";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';

import { getNetworkMulticall, getNetworkTokenShim } from 'features/helpers/getNetworkData';
import { byDecimals } from 'features/helpers/bignumber';

import {
  LEVERAGE_FETCH_ALLOWANCES_BEGIN,
  LEVERAGE_FETCH_ALLOWANCES_SUCCESS,
  LEVERAGE_FETCH_ALLOWANCES_FAILURE,
} from './constants';

export function fetchAllowances(data) {
  return dispatch => {
    dispatch({
      type: LEVERAGE_FETCH_ALLOWANCES_BEGIN,
      data: data.forceUpdate || false
    });

    const promise = new Promise((resolve, reject) => {
      const { address, web3, leverageOptions, network } = data;

      const tokenCalls = leverageOptions.map(option => {
        const tokens = option.tokens.map(token => token.address);

        return tokens.map( (token, index) => {
          const contract = new web3.eth.Contract(erc20ABI, token || getNetworkTokenShim(network));

          //spenderAddress:
          // - first token to be approved against bigfoot contract
          // - all other tokens in the array to be approved against bank contract
          const spenderAddress = (index === 0) ? option.bigfootAddress : option.bankAddress;

          return {
            leverageOption: option.title,
            token: token || '',
            allowance: contract.methods.allowance(address, spenderAddress)
          };
        });
      }).flat();


      const multicall = new MultiCall(web3, getNetworkMulticall(network));
      multicall.all([tokenCalls])
        .then(data => {
          const allowances = {};

          // Process leverageOptions allowances
          data[0].forEach(response => {
            allowances[response.leverageOption] = {
              ...allowances[response.leverageOption],
              [response.token]: new BigNumber(response.allowance).toNumber()
            }
          });

          const leverageOptionsData = {};

          leverageOptions.map(option => {
            const allowance = allowances[option.title];
            leverageOptionsData[option.title] = { allowance }
          })

          dispatch({
            type: LEVERAGE_FETCH_ALLOWANCES_SUCCESS,
            data: leverageOptionsData,
          });

          resolve()
        })
        .catch(error => {
          dispatch({
            type: LEVERAGE_FETCH_ALLOWANCES_FAILURE,
          });

          return reject(error.message || error);
        });
    });

    return promise;
  }
}


export function useFetchAllowances() {
  // args: false value or array
  // if array, means args passed to the action creator
  const dispatch = useDispatch();

  const { pools, fetchAllowancesDone, fetchAllowancesPending } = useSelector(
    state => ({
      pools: state.leverage.pools,
      fetchAllowancesDone: state.leverage.fetchAllowancesDone,
      fetchAllowancesPending: state.leverage.fetchAllowancesPending,
    }),
    shallowEqual,
  );

  const boundAction = useCallback(
    (data) => {
      return dispatch(fetchAllowances(data));
    },
    [dispatch],
  );

  return {
    pools,
    fetchAllowances: boundAction,
    fetchAllowancesDone,
    fetchAllowancesPending
  };
}


export function reducer(state, action) {
  const { pools, fetchAllowancesDone } = state;

  switch (action.type) {
    case LEVERAGE_FETCH_ALLOWANCES_BEGIN:
      return {
        ...state,
        fetchAllowancesDone: action.data ? false : fetchAllowancesDone,
        fetchAllowancesPending: true,
      };

    case LEVERAGE_FETCH_ALLOWANCES_SUCCESS:

      const updatedPools = pools.map(option => {
        if (! action.data[option.title]) {
          return option;
        }

        const { allowance } = action.data[option.title];
        return {
          ...option,
          allowance
        }
      });

      return {
        ...state,
        pools: pools,
        fetchAllowancesDone: true,
        fetchAllowancesPending: false,
      };

    case LEVERAGE_FETCH_ALLOWANCES_FAILURE:
      return {
        ...state,
        fetchAllowancesPending: false,
      };

    default:
      return state;
  }
}
