import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import async from 'async';

import { fetchFarmStaked } from '../../web3';

import {
  FARM_FETCH_POOLS_STAKED_BEGIN,
  FARM_FETCH_POOLS_STAKED_SUCCESS,
  FARM_FETCH_POOLS_STAKED_FAILURE
} from './constants';

export function fetchPoolsStaked({ address, web3, pools }) {
  return dispatch => {
    dispatch({
      type: FARM_FETCH_POOLS_STAKED_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      async.map(pools, (pool, callback) => {
        async.parallel([
          (callbackInner) => {
            const { earnContractAbi, earnContractAddress, masterchefPid } = pool;
            fetchFarmStaked({
              web3,
              address,
              earnContractAddress,
              earnContractAbi,
              masterchefPid
            }).then(
              data => callbackInner(null, data)
            ).catch(
              error => {
                return callbackInner(error.message || error)
              }
            )
          }
        ], (error, data) => {
          pool.stakedAmount = data[0] || null;
          callback(null, pool)
        })
      }, (error, pools) => {
        if (error) {
          dispatch({
            type: FARM_FETCH_POOLS_STAKED_FAILURE,
          })
          return reject(error.message || error)
        }

        dispatch({
          type: FARM_FETCH_POOLS_STAKED_SUCCESS,
          data: pools,
        })
        resolve()
      });
    });

    return promise;
  };
}

export function useFetchPoolsStaked() {
  const dispatch = useDispatch();

  const { pools, fetchPoolsStakedPending, fetchPoolsStakedDone } = useSelector(
    state => ({
      pools: state.farm.pools,
      fetchPoolsStakedDone: state.farm.fetchPoolsStakedDone,
      fetchPoolsStakedPending: state.farm.fetchPoolsStakedPending,
    }),
    shallowEqual
  );

  const boundAction = useCallback(
    (data) => {
      return dispatch(fetchPoolsStaked(data));
    },
    [dispatch],
  );

  return {
    pools,
    fetchPoolsStaked: boundAction,
    fetchPoolsStakedDone,
    fetchPoolsStakedPending,
  };
}

export function reducer(state, action) {
	switch (action.type) {
		case FARM_FETCH_POOLS_STAKED_BEGIN:
			return {
				...state,
				fetchPoolsStakedPending: true,
			};

		case FARM_FETCH_POOLS_STAKED_SUCCESS:
			return {
				...state,
				pools: action.data,
				fetchPoolsStakedDone: true,
				fetchPoolsStakedPending: false,
			};

		case FARM_FETCH_POOLS_STAKED_FAILURE:
			return {
				...state,
				fetchPoolsStakedPending: false,
			};

		default:
			return state;
	}
}
