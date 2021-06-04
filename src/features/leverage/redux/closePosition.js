import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'features/common/redux/actions';

import BankHelper from '../banks/BankHelper';

import {
  LEVERAGE_CLOSE_POSITION_BEGIN,
  LEVERAGE_CLOSE_POSITION_SUCCESS,
  LEVERAGE_CLOSE_POSITION_FAILURE
} from './constants';

const closePosition = ({ address, web3, pool, bank, positionId }) => {
  return dispatch => {
    dispatch({
      type: LEVERAGE_CLOSE_POSITION_BEGIN,
      bankId: bank.id,
      positionId
    });

    return new Promise((resolve, reject) => {
      const onError = error => {
        dispatch({
          type: LEVERAGE_CLOSE_POSITION_FAILURE,
          bankId: bank.id,
          positionId
        });

        reject(error.message || error);
      }

      const bankInstance = BankHelper.getBankInstance(bank);
      if (! bankInstance) {
        onError('Can\'t close position using specified bank');
      }

      bankInstance.closePosition({ address, web3, pool, bank, positionId })
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
              type: LEVERAGE_CLOSE_POSITION_SUCCESS,
              bankId: bank.id,
              positionId
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


export function useClosePosition() {
  const dispatch = useDispatch();

  const { closePositionPending } = useSelector(
    state => ({
      closePositionPending: state.leverage.closePositionPending,
    })
  );

  const closePositionAction = useCallback(data => dispatch(closePosition(data)), [dispatch]);

  return {
    closePosition: closePositionAction,
    closePositionPending
  };
}


export function reducer(state, action) {
  switch (action.type) {
    case LEVERAGE_CLOSE_POSITION_BEGIN:
      return {
        ...state,
        closePositionPending: {
          ...state.closePositionPending,
          [action.bankId]: {
            ...state.closePositionPending[action.bankId],
            [action.positionId]: true
          }
        },
      };

    case LEVERAGE_CLOSE_POSITION_SUCCESS:
      return {
        ...state,
        closePositionPending: {
          ...state.closePositionPending,
          [action.bankId]: {
            ...state.closePositionPending[action.bankId],
            [action.positionId]: false
          }
        },
      };

    case LEVERAGE_CLOSE_POSITION_FAILURE:
      return {
        ...state,
        closePositionPending: {
          ...state.closePositionPending,
          [action.bankId]: {
            ...state.closePositionPending[action.bankId],
            [action.positionId]: false
          }
        },
      };

    default:
      return state;
  }
}