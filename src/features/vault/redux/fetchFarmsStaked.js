import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import BigNumber from 'bignumber.js';

import { MultiCall } from 'eth-multicall';
import { getNetworkMulticall } from 'features/helpers/getNetworkData';

import { byDecimals } from 'features/helpers/bignumber';
import { pool4Abi } from 'features/configure/abi';

import { fetchFarmStaked } from '../../web3';

import {
  VAULT_FETCH_FARMS_STAKED_BEGIN,
  VAULT_FETCH_FARMS_STAKED_SUCCESS,
  VAULT_FETCH_FARMS_STAKED_FAILURE,
  VAULT_FETCH_SINGLE_FARM_STAKED_SUCCESS,
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
          const stakedAmounts = {};

          pools.map(pool => {
            const callIndex = farmPools.findIndex(farmPool => farmPool.id == pool.id);

            stakedAmounts[pool.id] = callIndex >= 0
              ? byDecimals(results[callIndex].stakedAmount[0], pool.farm.earnedTokenDecimals)
              : new BigNumber(0);
          })

          dispatch({
            type: VAULT_FETCH_FARMS_STAKED_SUCCESS,
            data: stakedAmounts,
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

export function fetchSingleFarmStaked({ address, web3, pool }) {
  return dispatch => {
    const { earnContractAddress, masterchefPid } = pool.farm;

    fetchFarmStaked({
      web3,
      address,
      earnContractAddress,
      earnContractAbi: null,
      masterchefPid
    })
      .then(data => {
        dispatch({
          type: VAULT_FETCH_SINGLE_FARM_STAKED_SUCCESS,
          id: pool.id,
          data: byDecimals(data, pool.farm.earnedTokenDecimals)
        });
      })
      .catch(error => console.info(error));
  }
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
  const { pools } = state;

  switch (action.type) {
    case VAULT_FETCH_FARMS_STAKED_BEGIN:
      return {
        ...state,
        fetchFarmsStakedPending: true,
      };

    case VAULT_FETCH_FARMS_STAKED_SUCCESS:
      const updatedPools = pools.map(pool => {
        const stakedAmount = action.data[pool.id];

        return {
          ...pool,
          stakedAmount
        }
      });

      return {
        ...state,
        pools: updatedPools,
        fetchFarmsStakedDone: true,
        fetchFarmsStakedPending: false,
      };

    case VAULT_FETCH_SINGLE_FARM_STAKED_SUCCESS:
      const newPools = pools.map(pool => {
        return pool.id == action.id
          ? {
            ...pool,
            stakedAmount: action.data
          }
          : pool;
      });

      return {
        ...state,
        pools: newPools
      }

    case VAULT_FETCH_FARMS_STAKED_FAILURE:
      return {
        ...state,
        fetchFarmsStakedPending: false,
      };

    default:
      return state;
  }
}
