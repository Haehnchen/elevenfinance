import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
  LEVERAGE_FETCH_POOLS_DATA_BEGIN,
  LEVERAGE_FETCH_POOLS_DATA_SUCCESS,
  LEVERAGE_FETCH_POOLS_DATA_FAILURE
} from './constants';

const fetchPoolsData = ({ banks, pools}) => {
  return dispatch => {
    dispatch({
      type: LEVERAGE_FETCH_POOLS_DATA_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      (async () => {
        try {
          const response = await fetch(process.env.API_URL);
          const apiData = await response.json();

          const poolsData = {};

          pools.map(pool => {
            const poolData = apiData[pool.apiKey];
            if (! poolData) {
              return;
            }

            poolsData[pool.id] = {
              apy: poolData.farm.apy,
              aprd: poolData.farm.aprd,
            }
          });

          const banksData = {};

          for (let key in banks) {
            const bankData = apiData[banks[key].apiKey];
            if (! bankData) {
              continue;
            }

            banksData[key] = {
              baseBorrowApy: bankData.baseborrowapy,
              utilization: bankData.utilization
            }
          }

          dispatch({
            type: LEVERAGE_FETCH_POOLS_DATA_SUCCESS,
            data: {
              banks: banksData,
              pools: poolsData
            },
          })

          resolve();
        } catch (error) {
          dispatch({
            type: LEVERAGE_FETCH_POOLS_DATA_FAILURE,
          });

          reject(error.message || error);
        }
      })()
    });

    return promise;
  };
}

export function useFetchPoolsData() {
  const dispatch = useDispatch();

  const { banks, pools, fetchPoolsDataDone, fetchPoolsDataPending } = useSelector(
    state => ({
      banks: state.leverage.banks,
      pools: state.leverage.pools,
      fetchPoolsDataDone: state.leverage.fetchPoolsDataDone,
      fetchPoolsDataPending: state.leverage.fetchPoolsDataPending,
    }),
    shallowEqual
  );

  const fetchPoolsDataAction = useCallback(data => dispatch(fetchPoolsData(data)), [dispatch],);

  return {
    banks,
    pools,
    fetchPoolsData: fetchPoolsDataAction,
    fetchPoolsDataDone,
    fetchPoolsDataPending,
  };
}

export function reducer(state, action) {
  const { banks, pools } = state;

  switch (action.type) {
    case LEVERAGE_FETCH_POOLS_DATA_BEGIN:
      return {
        ...state,
        fetchPoolsDataPending: true,
      };

    case LEVERAGE_FETCH_POOLS_DATA_SUCCESS:
      const updatedPools = pools.map(pool => {
        const poolData = action.data.pools[pool.id];

        return {
          ...pool,
          ...poolData
        }
      });

      const updatedBanks = {};
      for (let key in banks) {
        const bankData = action.data.banks[key];

        updatedBanks[key] = {
          ...banks[key],
          ...bankData
        }
      }

      return {
        ...state,
        banks: updatedBanks,
        pools: updatedPools,
        fetchPoolsDataDone: true,
        fetchPoolsDataPending: false,
      };

    case LEVERAGE_FETCH_POOLS_DATA_FAILURE:
      return {
        ...state,
        fetchPoolsDataPending: false,
      }

    default:
      return state;
  }
}
