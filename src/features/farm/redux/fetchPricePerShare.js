import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { vaultERC20 } from '../../configure';

import {
  FARM_FETCH_PRICE_PER_SHARE_BEGIN,
  FARM_FETCH_PRICE_PER_SHARE_SUCCESS,
  FARM_FETCH_PRICE_PER_SHARE_FAILURE,
} from './constants';

export function fetchPricePerShare(index) {

	return (dispatch, getState) => {
		dispatch({
			type: FARM_FETCH_PRICE_PER_SHARE_BEGIN,
			index
		});

		const promise = new Promise((resolve, reject) => {
			const { home, farm } = getState();
      const { web3 } = home;
      const { pools } = farm;
      const { tokenAddress } = pools[index];

			const contract = new web3.eth.Contract(vaultERC20, tokenAddress);
			contract.methods.getPricePerFullShare().call().then(
        data => {
          dispatch({
            type: FARM_FETCH_PRICE_PER_SHARE_SUCCESS,
            data: new BigNumber(data),
            index
          });
          resolve(data);
        },
      ).catch(
        error => {
          dispatch({
            type: FARM_FETCH_PRICE_PER_SHARE_FAILURE,
            index
          });
          reject(error.message || error);
        }
      )
		});

		return promise;
	}

}

export function useFetchPricePerShare() {
  const dispatch = useDispatch();

  const { pricePerShare, fetchPricePerSharePending } = useSelector(
    state => ({
      pricePerShare: state.farm.pricePerShare,
      fetchPricePerSharePending: state.farm.fetchPricePerSharePending,
    })
  );

  const boundAction = useCallback(
    data => dispatch(fetchPricePerShare(data)),
    [dispatch],
  );

  return {
    pricePerShare,
    fetchPricePerShare: boundAction,
    fetchPricePerSharePending
  };
}

export function reducer(state, action) {
  const { pricePerShare, fetchPricePerSharePending } = state;
  switch (action.type) {
    case FARM_FETCH_PRICE_PER_SHARE_BEGIN:
      // Just after a request is sent
      fetchPricePerSharePending[action.index] = true;
      return {
        ...state,
        fetchPricePerSharePending,
      };

    case FARM_FETCH_PRICE_PER_SHARE_SUCCESS:
      // The request is success

      pricePerShare[action.index] = action.data;
      fetchPricePerSharePending[action.index] = false;

      return {
        ...state,
        pricePerShare,
        fetchPricePerSharePending,
      };

    case FARM_FETCH_PRICE_PER_SHARE_FAILURE:
      // The request is failed
      fetchPricePerSharePending[action.index] = false;
      return {
        ...state,
        fetchPricePerSharePending,
      };

    default:
      return state;
  }
}