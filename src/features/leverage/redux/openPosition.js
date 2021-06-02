import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'features/common/redux/actions';

import BigfootBnb from '../banks/BigfootBnb';

import {
  LEVERAGE_OPEN_POSITION_BEGIN,
  LEVERAGE_OPEN_POSITION_SUCCESS,
  LEVERAGE_OPEN_POSITION_FAILURE
} from './constants';

const openPosition = ({ address, web3, network, pool, bank, amounts, leverage }) => {
  return dispatch => {
    dispatch({
      type: LEVERAGE_OPEN_POSITION_BEGIN,
      id: pool.id
    });

    return new Promise((resolve, reject) => {
      const onError = error => {
        dispatch({
          type: LEVERAGE_OPEN_POSITION_FAILURE,
          id: pool.id
        });

        reject(error.message || error);
      }

      const bankInstance = getBankInstance(bank);
      if (! bankInstance) {
        onError('Can\'t open position using specified bank');
      }

      bankInstance.openPosition({ address, web3, network, pool, bank, amounts, leverage })
        .then(res => {
          res.tx.on('transactionHash', hash => {
            console.log(hash)
            dispatch(enqueueSnackbar({
              message: hash,
              options: {
                key: new Date().getTime() + Math.random(),
                variant: 'success'
              },
              hash
            }));
          })
          .on('receipt', receipt => {
            dispatch({
              type: LEVERAGE_OPEN_POSITION_SUCCESS,
              id: pool.id
            });

            resolve()
          })
          .on('error', onError)
          .catch(onError);
        })
        .catch(onError)
    });
  }
}

const getBankInstance = bank => {
  switch (bank.id) {
    case 'bfbnb':
      return new BigfootBnb();

    default:
      return null;
  }
}

export function useOpenPosition() {
  const dispatch = useDispatch();

  const { openPositionPending } = useSelector(
    state => ({
      openPositionPending: state.leverage.openPositionPending,
    })
  );

  const openPositionAction = useCallback(data => dispatch(openPosition(data)), [dispatch]);

  return {
    openPosition: openPositionAction,
    openPositionPending
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case LEVERAGE_OPEN_POSITION_BEGIN:
      return {
        ...state,
        openPositionPending: {
          ...state.openPositionPending,
          [action.id]: true
        },
      };

    case LEVERAGE_OPEN_POSITION_SUCCESS:
      return {
        ...state,
        openPositionPending: {
          ...state.openPositionPending,
          [action.id]: false
        },
      };

    case LEVERAGE_OPEN_POSITION_FAILURE:
      return {
        ...state,
        openPositionPending: {
          ...state.openPositionPending,
          [action.id]: false
        },
      };

    default:
      return state;
  }
}