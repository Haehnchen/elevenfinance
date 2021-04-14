import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import async from 'async';

import { fetchPendingReward } from '../../web3';
import { byDecimals } from 'features/helpers/bignumber';

import {
  VAULT_FETCH_PENDING_REWARDS_BEGIN,
  VAULT_FETCH_PENDING_REWARDS_SUCCESS,
  VAULT_FETCH_PENDING_REWARDS_FAILURE
} from './constants';

export function fetchPendingRewards({ address, web3, pools }) {
  return dispatch => {
    dispatch({
      type: VAULT_FETCH_PENDING_REWARDS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const farmPools = pools.filter(pool => pool.claimable);
      async.map(farmPools, (pool, callback) => {
        const { earnContractAddress, tokenDecimals } = pool;

        async.parallel([
          // Get pending ELE reward
          (callbackInner) => {
            const tokenName = 'Eleven';

            fetchPendingReward({
              web3,
              address,
              earnContractAddress,
              tokenName
            }).then(
              data => callbackInner(null, data)
            ).catch(
              error => {
                return callbackInner(error.message || error)
              }
            )
          },

          // Get pending 11-token reward
          (callbackInner) => {
            const tokenName = pool.claimableRewardMethod;

            fetchPendingReward({
              web3,
              address,
              earnContractAddress,
              tokenName
            }).then(
              data => callbackInner(null, data)
            ).catch(
              error => {
                return callbackInner(error.message || error)
              }
            )
          }
        ], (error, data) => {
          callback(null, {
            id: pool.id,
            pendingEle: data[0] ? byDecimals(data[0], 18) : null,
            pendingToken: data[1] ? byDecimals(data[1], tokenDecimals) : null,
          })
        })
      }, (error, data) => {
        if (error) {
          dispatch({
            type: VAULT_FETCH_PENDING_REWARDS_FAILURE,
          })
          return reject(error.message || error)
        }

        const pendingRewards = {};
        data.forEach(pool => {
          pendingRewards[pool.id] = pool;
        });

        dispatch({
          type: VAULT_FETCH_PENDING_REWARDS_SUCCESS,
          data: pendingRewards,
        })
        resolve()
      });
    });

    return promise;
  };
}

export function useFetchPendingRewards() {
  const dispatch = useDispatch();

  const { pendingRewards, fetchPendingRewardsPending, fetchPendingRewardsDone } = useSelector(
    state => ({
      pendingRewards: state.vault.pendingRewards,
      fetchPendingRewardsDone: state.vault.fetchPendingRewardsDone,
      fetchPendingRewardsPending: state.vault.fetchPendingRewardsPending,
    }),
    shallowEqual
  );

  const boundAction = useCallback(
    (data) => {
      return dispatch(fetchPendingRewards(data));
    },
    [dispatch],
  );

  return {
    pendingRewards,
    fetchPendingRewards: boundAction,
    fetchPendingRewardsDone,
    fetchPendingRewardsPending,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case VAULT_FETCH_PENDING_REWARDS_BEGIN:
      return {
        ...state,
        fetchPendingRewardsPending: true,
      };

    case VAULT_FETCH_PENDING_REWARDS_SUCCESS:
      return {
        ...state,
        pendingRewards: action.data,
        fetchPendingRewardsDone: true,
        fetchPendingRewardsPending: false,
      };

    case VAULT_FETCH_PENDING_REWARDS_FAILURE:
      return {
        ...state,
        fetchPendingRewardsPending: false,
      };

    default:
      return state;
  }
}
