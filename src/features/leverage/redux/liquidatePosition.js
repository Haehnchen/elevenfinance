import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSnackbar } from 'features/common/redux/actions';

import BankHelper from '../banks/BankHelper';

import {
  LEVERAGE_LIQUIDATE_POSITION_BEGIN,
  LEVERAGE_LIQUIDATE_POSITION_SUCCESS,
  LEVERAGE_LIQUIDATE_POSITION_FAILURE
} from './constants';

const liquidatePosition = ({ address, web3, bank, positionId }) => {
  return dispatch => {
    dispatch({
      type: LEVERAGE_LIQUIDATE_POSITION_BEGIN,
      bankId: bank.id,
      positionId
    });

    return new Promise((resolve, reject) => {
      const onError = error => {
        dispatch({
          type: LEVERAGE_LIQUIDATE_POSITION_FAILURE,
          bankId: bank.id,
          positionId
        });

        reject(error.message || error);
      }

      const bankInstance = BankHelper.getBankInstance(bank);
      if (! bankInstance) {
        onError('Can\'t liquidate position using specified bank');
      }

      bankInstance.liquidatePosition({ address, web3, bank, positionId })
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
              type: LEVERAGE_LIQUIDATE_POSITION_SUCCESS,
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


export function useLiquidatePosition() {
  const dispatch = useDispatch();

  const { liquidatePositionPending } = useSelector(
    state => ({
      liquidatePositionPending: state.leverage.liquidatePositionPending,
    })
  );

  const liquidatePositionAction = useCallback(data => dispatch(liquidatePosition(data)), [dispatch]);

  return {
    liquidatePosition: liquidatePositionAction,
    liquidatePositionPending
  };
}


export function reducer(state, action) {
  switch (action.type) {
    case LEVERAGE_LIQUIDATE_POSITION_BEGIN:
      return {
        ...state,
        liquidatePositionPending: {
          ...state.liquidatePositionPending,
          [action.bankId]: {
            ...state.liquidatePositionPending[action.bankId],
            [action.positionId]: true
          }
        },
      };

    case LEVERAGE_LIQUIDATE_POSITION_SUCCESS:
      return {
        ...state,
        liquidatePositionPending: {
          ...state.liquidatePositionPending,
          [action.bankId]: {
            ...state.liquidatePositionPending[action.bankId],
            [action.positionId]: false
          }
        },
      };

    case LEVERAGE_LIQUIDATE_POSITION_FAILURE:
      return {
        ...state,
        liquidatePositionPending: {
          ...state.liquidatePositionPending,
          [action.bankId]: {
            ...state.liquidatePositionPending[action.bankId],
            [action.positionId]: false
          }
        },
      };

    default:
      return state;
  }
}