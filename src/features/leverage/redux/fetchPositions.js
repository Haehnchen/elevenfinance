import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { MultiCall } from 'eth-multicall';

import { byDecimals } from 'features/helpers/bignumber';
import { getNetworkMulticall } from 'features/helpers/getNetworkData';

import {
  LEVERAGE_FETCH_POSITIONS_BEGIN,
  LEVERAGE_FETCH_POSITIONS_SUCCESS,
  LEVERAGE_FETCH_POSITIONS_FAILURE
} from './constants';

import bankAbi from 'features/configure/abis/bigfootBankCommon';

const fetchPositions = ({ web3, banks, pools, network, forceUpdate }) => {
  return dispatch => {
    dispatch({
      type: LEVERAGE_FETCH_POSITIONS_BEGIN,
      data: forceUpdate || false
    });

    const promise = new Promise((resolve, reject) => {
      const onError = error => {
        const message = error.message || error;
        console.info('Unable to load positions list: ' + message);

        dispatch({
          type: LEVERAGE_FETCH_POSITIONS_FAILURE,
        });

        reject(error.message || error);
      }

      const banksContracts = [];
      for (let key in banks) {
        banksContracts.push({
          id: key,
          contract: new web3.eth.Contract(bankAbi, banks[key].address)
        });
      }

      const multicall = new MultiCall(web3, getNetworkMulticall(network));
      const nextIdCalls = banksContracts.map(bank => {
        return {
          nextId: bank.contract.methods.nextPositionID()
        }
      });

      multicall.all([nextIdCalls]).then(([banksNextIds]) => {
        const calls = Object.keys(banks).map((bankId, bankIndex) => {
          const nextPositionId = +banksNextIds[bankIndex].nextId;

          const bankCalls = [];
          for (let i = 1; i < nextPositionId; i++) {
            bankCalls.push({
              details: banksContracts[bankIndex].contract.methods.positions(i),
              info: banksContracts[bankIndex].contract.methods.positionInfo(i)
            });
          }

          return bankCalls;
        });

        multicall.all(calls).then(results => {
          const positions = Object.keys(banks).map((bankId, bankIndex) => {
            return results[bankIndex].map((position, positionIndex) => {
              const poolAddress = position.details[0];
              const owner = position.details[1];
              const pool = pools.find(pool => pool.bigfootAddress == poolAddress);

              const size = byDecimals(position.info[0], banks[bankId].tokenDecimals);
              const debtSize = byDecimals(position.info[1], banks[bankId].tokenDecimals);
              const collateral = size.minus(debtSize);

              if (pool === undefined || collateral.lte(0)) {
                return null;
              }

              const leverage = size.div(collateral);
              const debtRatio = leverage.div(pool.deathLeverage).times(100);

              return {
                id: positionIndex + 1,
                bankId,
                poolId: pool.id,
                poolAddress,
                owner,
                size,
                debtSize,
                collateral,
                leverage,
                debtRatio
              }
            });
          })
            .flat()
            .filter(position => !! position)
            .sort((a, b) => b.debtRatio.comparedTo(a.debtRatio));

          dispatch({
            type: LEVERAGE_FETCH_POSITIONS_SUCCESS,
            data: positions
          });

          resolve();
        })
        .catch(onError);
      })
      .catch(onError);
    });

    return promise;
  };
}

export function useFetchPositions() {
  const dispatch = useDispatch();

  const { positions, fetchPositionsDone, fetchPositionsPending } = useSelector(
    state => ({
      positions: state.leverage.positions,
      fetchPositionsDone: state.leverage.fetchPositionsDone,
      fetchPositionsPending: state.leverage.fetchPositionsPending,
    }),
    shallowEqual
  );

  const fetchPositionsAction = useCallback(data => dispatch(fetchPositions(data)), [dispatch]);

  return {
    positions,
    fetchPositions: fetchPositionsAction,
    fetchPositionsDone,
    fetchPositionsPending,
  };
}

export function reducer(state, action) {
  const { fetchPositionsDone } = state;

  switch (action.type) {
    case LEVERAGE_FETCH_POSITIONS_BEGIN:
      return {
        ...state,
        fetchPositionsDone: action.data ? false : fetchPositionsDone,
        fetchPositionsPending: true,
      };

    case LEVERAGE_FETCH_POSITIONS_SUCCESS:
      return {
        ...state,
        positions: action.data,
        fetchPositionsDone: true,
        fetchPositionsPending: false,
      };

    case LEVERAGE_FETCH_POSITIONS_FAILURE:
      return {
        ...state,
        fetchPositionsPending: false,
      }

    default:
      return state;
  }
}
