import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'features/common/redux/actions';

import BankHelper from '../banks/BankHelper';

import {
  LEVERAGE_ADJUST_POSITION_BEGIN,
  LEVERAGE_ADJUST_POSITION_SUCCESS,
  LEVERAGE_ADJUST_POSITION_FAILURE
} from './constants';

import { fetchPositions } from './actions';

const adjustPosition = ({ address, web3, network, position, pool, bank, amounts }) => {
  return (dispatch, getState) => {
    dispatch({
      type: LEVERAGE_ADJUST_POSITION_BEGIN,
      bankId: bank.id,
      id: position.id
    });

    return new Promise((resolve, reject) => {
      const onError = error => {
        dispatch({
          type: LEVERAGE_ADJUST_POSITION_FAILURE,
          bankId: bank.id,
          id: position.id
        });

        reject(error.message || error);
      }

      const bankInstance = BankHelper.getBankInstance(bank);
      if (! bankInstance) {
        onError('Can\'t open position using specified bank');
      }

      bankInstance.adjustPosition({ address, web3, network, position, pool, bank, amounts })
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
              type: LEVERAGE_ADJUST_POSITION_SUCCESS,
              bankId: bank.id,
              id: position.id
            });

            const { leverage } = getState();
            const { banks, pools } = leverage;
            dispatch(fetchPositions({ web3, banks, pools, network }))

            resolve()
          })
          .on('error', onError)
          .catch(onError);
        })
        .catch(onError)
    });
  }
}

export function useAdjustPosition() {
  const dispatch = useDispatch();

  const { adjustPositionPending } = useSelector(
    state => ({
      adjustPositionPending: state.leverage.adjustPositionPending,
    })
  );

  const adjustPositionAction = useCallback(data => dispatch(adjustPosition(data)), [dispatch]);

  return {
    adjustPosition: adjustPositionAction,
    adjustPositionPending
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case LEVERAGE_ADJUST_POSITION_BEGIN:
      return {
        ...state,
        adjustPositionPending: {
          ...state.adjustPositionPending,

          [action.bankId]: {
            ...state.adjustPositionPending[action.bankId],
            [action.id]: true
          }
        },
      };

    case LEVERAGE_ADJUST_POSITION_SUCCESS:
      return {
        ...state,
        adjustPositionPending: {
          ...state.adjustPositionPending,
          [action.bankId]: {
            ...state.adjustPositionPending[action.bankId],
            [action.id]: false
          }
        },
      };

    case LEVERAGE_ADJUST_POSITION_FAILURE:
      return {
        ...state,
        adjustPositionPending: {
          ...state.adjustPositionPending,
          [action.bankId]: {
            ...state.adjustPositionPending[action.bankId],
            [action.id]: false
          }
        },
      };

    default:
      return state;
  }
}