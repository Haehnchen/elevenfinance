import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { fetchPancakeOutputAmount } from '../../web3';

import { HOME_FETCH_TOKEN_PRICE_SUCCESS } from './constants';

export function fetchTokenPrice({ web3 }) {
  return dispatch => {
    const path = [
      '0xacd7b3d9c10e97d0efa418903c0c7669e702e4c0', // ELE
      '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // BNB
      '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
    ]

    const amountIn = new BigNumber(10).exponentiatedBy(18).toString();

    fetchPancakeOutputAmount({ web3, amountIn, path})
      .then(tokenPrice => {
        dispatch({
          type: HOME_FETCH_TOKEN_PRICE_SUCCESS,
          data: tokenPrice.dividedBy(new BigNumber(10).exponentiatedBy(18))
        })
      });
  }
}

export function useFetchTokenPrice() {
  const dispatch = useDispatch();

  const { tokenPriceUsd, fetchTokenPriceDone } = useSelector(
    state => ({
      tokenPriceUsd: state.home.tokenPriceUsd,
      fetchTokenPriceDone: state.home.fetchTokenPriceDone
    }),
    shallowEqual
  )

  const fetchPriceAction = useCallback(data => dispatch(fetchTokenPrice(data)), [dispatch]);

  return {
    tokenPriceUsd,
    fetchTokenPrice: fetchPriceAction,
    fetchTokenPriceDone,
  }
};

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_TOKEN_PRICE_SUCCESS:
      return {
        ...state,

        tokenPriceUsd: action.data,
        fetchTokenPriceDone: true,
      }

    default:
      return state;
  }
}