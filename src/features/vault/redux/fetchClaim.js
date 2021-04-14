import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { claimRewards } from '../../web3'

import {
  VAULT_FETCH_CLAIM_BEGIN,
  VAULT_FETCH_CLAIM_SUCCESS,
  VAULT_FETCH_CLAIM_FAILURE,
} from './constants';

export function fetchClaim({ address, web3, contractAddress, index }) {
  return dispatch => {
    dispatch({
      type: VAULT_FETCH_CLAIM_BEGIN,
      index,
    });

    const promise = new Promise((resolve, reject) => {
      claimRewards({ web3, address, contractAddress, dispatch })
        .then(data => {
          dispatch({
            type: VAULT_FETCH_CLAIM_SUCCESS,
            data,
            index,
          });
          resolve(data);
        })
        .catch(error => {
          dispatch({
            type: VAULT_FETCH_CLAIM_FAILURE,
            index,
          });
          reject(error.message || error);
        });
    });
    return promise;
  };
}

export function useFetchClaim() {
  const dispatch = useDispatch();

  const { fetchClaimPending } = useSelector(state => ({
    fetchClaimPending: state.vault.fetchClaimPending,
  }));

  const boundAction = useCallback(data => dispatch(fetchClaim(data)), [dispatch]);

  return {
    fetchClaim: boundAction,
    fetchClaimPending,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case VAULT_FETCH_CLAIM_BEGIN:
      return {
        ...state,
        fetchClaimPending: {
          ...state.fetchClaimPending,
          [action.index]: true,
        },
      };

    case VAULT_FETCH_CLAIM_SUCCESS:
      return {
        ...state,
        fetchClaimPending: {
          ...state.fetchClaimPending,
          [action.index]: false,
        },
      };

    case VAULT_FETCH_CLAIM_FAILURE:
      return {
        ...state,
        fetchClaimPending: {
          ...state.fetchClaimPending,
          [action.index]: false,
        },
      };

    default:
      return state;
  }
}
