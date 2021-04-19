import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import async from 'async';

import { byDecimals } from 'features/helpers/bignumber';
import { fetchFarmStaked } from '../../web3';

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

      async.map(farmPools, (pool, callback) => {
        const { earnedTokenDecimals, earnContractAddress, masterchefPid } = pool.farm;

        fetchFarmStaked({
          web3,
          address,
          earnContractAddress,
          earnContractAbi: null,
          masterchefPid
        }).then(data => {
          callback(null, {
            id: pool.id,
            stakedAmount: data
              ? byDecimals(data, earnedTokenDecimals)
              : null
          })
        })
        .catch(error => callback(error.message || error))
      }, (error, farmPools) => {
        if (error) {
          dispatch({
            type: VAULT_FETCH_FARMS_STAKED_FAILURE,
          })
          return reject(error.message || error)
        }

        pools = pools.map(pool => {
          farmPools.forEach(farmPool => {
            if (farmPool.id == pool.id) {
              pool.stakedAmount = farmPool.stakedAmount;
            }
          })

          return pool;
        })

        dispatch({
          type: VAULT_FETCH_FARMS_STAKED_SUCCESS,
          data: pools,
        })
        resolve()
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
