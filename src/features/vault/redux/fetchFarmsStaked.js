import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { MultiCall } from 'eth-multicall';

import { byDecimals } from 'features/helpers/bignumber';
import { getNetworkMulticall } from 'features/helpers/getNetworkData';
import { pool4Abi } from 'features/configure/abi';

import {
  VAULT_FETCH_FARMS_STAKED_BEGIN,
  VAULT_FETCH_FARMS_STAKED_SUCCESS,
  VAULT_FETCH_FARMS_STAKED_FAILURE
} from './constants';

export function fetchFarmsStaked({ address, web3, pools }) {
  return dispatch => {
    dispatch({
      type: VAULT_FETCH_FARMS_STAKED_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const farmPools = pools.filter(pool => pool.farm);

      const multicall = new MultiCall(web3, getNetworkMulticall());

      const calls = farmPools.map(pool => {
        const { earnContractAddress, masterchefPid } = pool.farm;

        const contract = new web3.eth.Contract(pool4Abi, earnContractAddress);
        return {
          stakedAmount: contract.methods.userInfo(masterchefPid, address)
        };
      });

      multicall
        .all([calls])
        .then(([results]) => {
          farmPools.map((farmPool, index) => {
            const stakedAmount = byDecimals(results[index].stakedAmount[0], farmPool.farm.earnedTokenDecimals);

            pools.map(pool => {
              if (pool.id == farmPool.id) {
                pool.stakedAmount = stakedAmount;
              }
            });
          });

          dispatch({
            type: VAULT_FETCH_FARMS_STAKED_SUCCESS,
            data: pools,
          })

          resolve();
        })
        .catch(error => {
          dispatch({
            type: VAULT_FETCH_FARMS_STAKED_FAILURE,
          });

          return reject(error.message || error);
        });
    });

    return promise;
  };
}

export function useFetchFarmsStaked() {
  const dispatch = useDispatch();

  const { pools, fetchFarmsStakedDone, fetchFarmsStakedPending } = useSelector(
    state => ({
      pools: state.vault.pools,
      fetchFarmsStakedDone: state.vault.fetchFarmsStakedDone,
      fetchFarmsStakedPending: state.vault.fetchFarmsStakedPending,
    }),
    shallowEqual
  );

  const boundAction = useCallback(
    (data) => {
      return dispatch(fetchFarmsStaked(data));
    },
    [dispatch],
  );

  return {
    pools,
    fetchFarmsStaked: boundAction,
    fetchFarmsStakedDone,
    fetchFarmsStakedPending,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case VAULT_FETCH_FARMS_STAKED_BEGIN:
      return {
        ...state,
        fetchFarmsStakedPending: true,
      };

    case VAULT_FETCH_FARMS_STAKED_SUCCESS:
      return {
        ...state,
        pools: action.data,
        fetchFarmsStakedDone: true,
        fetchFarmsStakedPending: false,
      };

    case VAULT_FETCH_FARMS_STAKED_FAILURE:
      return {
        ...state,
        fetchFarmsStakedPending: false,
      };

    default:
      return state;
  }
}
