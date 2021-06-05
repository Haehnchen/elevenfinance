import { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import {
  LEVERAGE_FETCH_BANKS_TOKENS_PRICES_BEGIN,
  LEVERAGE_FETCH_BANKS_TOKENS_PRICES_SUCCESS,
  LEVERAGE_FETCH_BANKS_TOKENS_PRICES_FAILURE
} from './constants';

import BankHelper from '../banks/BankHelper';

const fetchBanksTokensPrices = ({ web3, banks, network }) => {
  return dispatch => {
    dispatch({
      type: LEVERAGE_FETCH_BANKS_TOKENS_PRICES_BEGIN
    });

    const promise = new Promise((resolve, reject) => {
      const promises = [];

      const networkBanks = Object.values(banks).filter(bank => bank.network == network);

      networkBanks.forEach(bank => {
        const bankInstance = BankHelper.getBankInstance(bank);
        promises.push(bankInstance.getBankTokenPrice({ web3 }));
      });

      Promise.all(promises).then(results => {
        const tokensPrices = {};
        networkBanks.forEach((bank, index) => {
          tokensPrices[bank.id] = results[index];
        });

        dispatch({
          type: LEVERAGE_FETCH_BANKS_TOKENS_PRICES_SUCCESS,
          data: tokensPrices
        });

        resolve();
      })
      .catch(error => {
        dispatch({
          type: LEVERAGE_FETCH_BANKS_TOKENS_PRICES_FAILURE,
        });

        reject(error.message || error);
      })
    });

    return promise;
  };
}

export function useFetchBanksTokensPrices() {
  const dispatch = useDispatch();

  const { banks, fetchBanksTokensPricesDone, fetchBanksTokensPricesPending } = useSelector(
    state => ({
      banks: state.leverage.banks,
      fetchBanksTokensPricesDone: state.leverage.fetchBanksTokensPricesDone,
      fetchBanksTokensPricesPending: state.leverage.fetchBanksTokensPricesPending,
    }),
    shallowEqual
  );

  const fetchBanksTokensPricesAction = useCallback(data => dispatch(fetchBanksTokensPrices(data)), [dispatch]);

  return {
    banks,
    fetchBanksTokensPrices: fetchBanksTokensPricesAction,
    fetchBanksTokensPricesDone,
    fetchBanksTokensPricesPending,
  };
}

export function reducer(state, action) {
  const { banks } = state;

  switch (action.type) {
    case LEVERAGE_FETCH_BANKS_TOKENS_PRICES_BEGIN:
      return {
        ...state,
        fetchBanksTokensPricesPending: true,
      };

    case LEVERAGE_FETCH_BANKS_TOKENS_PRICES_SUCCESS:
      const updatedBanks = {...banks};

      for (let key in updatedBanks) {
        if (action.data[key]) {
          updatedBanks[key].tokenPrice = action.data[key]
        }
      }

      return {
        ...state,
        banks: updatedBanks,
        fetchBanksTokensPricesDone: true,
        fetchBanksTokensPricesPending: false,
      };

    case LEVERAGE_FETCH_BANKS_TOKENS_PRICES_FAILURE:
      return {
        ...state,
        fetchBanksTokensPricesPending: false,
      }

    default:
      return state;
  }
}
