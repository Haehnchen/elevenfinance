import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';

import { getNetworkMulticall, getNetworkTokenShim } from 'features/helpers/getNetworkData';
import { erc20ABI } from "../../configure";

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
      const { address, web3, pools, banks, network } = data;

      const networkPools = pools.filter(pool => pool.network == network);

      const tokenCalls = networkPools.map(pool => {
        const tokens = pool.tokens.map(token => token.address);

        return tokens.map((token, index) => {
          const contract = new web3.eth.Contract(erc20ABI, token || getNetworkTokenShim(network));
          const spenderAddress = banks[pool.bank].address;

          return {
            pool: pool.id,
            token: token || '',
            allowance: contract.methods.allowance(address, spenderAddress)
          };
        });
      }).flat();

      const multicall = new MultiCall(web3, getNetworkMulticall(network));
      multicall.all([tokenCalls])
        .then(data => {
          const allowances = {};

          // Process pools allowances
          data[0].forEach(allowance => {
            allowances[allowance.pool] = {
              ...allowances[allowance.pool],
              [allowance.token]: new BigNumber(allowance.allowance).toNumber()
            }
          });

          const poolsData = {};

          pools.map(pool => {
            const allowance = allowances[pool.id];
            poolsData[pool.id] = { allowance }
          })

          dispatch({
            type: LEVERAGE_FETCH_ALLOWANCES_SUCCESS,
            data: poolsData,
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
      const updatedPools = pools.map(pool => {
        if (! action.data[pool.id]) {
          return pool;
        }

        const { allowance } = action.data[pool.id];
        return {
          ...pool,
          allowance
        }
      });

      return {
        ...state,
        pools: updatedPools,
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
