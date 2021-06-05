import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { useSnackbar } from 'notistack';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useClosePosition, useLiquidatePosition } from '../../redux/hooks';

import Spinner from 'components/Spinner/Spinner';
import Tooltip from 'components/Tooltip/Tooltip';

import AdjustPosition from '../AdjustPosition/AdjustPosition';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Position({ position, bank, pool }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address, network } = useConnectWallet();
  const { closePosition, closePositionPending } = useClosePosition();
  const { liquidatePosition, liquidatePositionPending } = useLiquidatePosition();

  const isOwnPosition = position.owner.toLowerCase() == address.toLowerCase();
  const canBeLiquidated = position.debtRatio.gte(100);
  const isClosePending = closePositionPending[bank.id]?.[position.id];
  const isLiquidatePending = liquidatePositionPending[bank.id]?.[position.id];

  const onCloseButton = () => {
    const positionId = position.id;

    closePosition({ address, web3, pool, bank, positionId })
      .then(() => {
        enqueueSnackbar(`Position successfully closed`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Unable to close position: ${error}`, { variant: 'error' }))
  }

  const onLiquidateButton = () => {
    const positionId = position.id;

    liquidatePosition({ address, web3, bank, positionId })
      .then(() => {
        enqueueSnackbar(`Position successfully liquidated`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Unable to liquidate position: ${error}`, { variant: 'error' }))
  }

  return (
    <div className={classes.wrapper}>

      <div className={classes.nameBlock}>
        <div className={classes.name}>{ pool.name }</div>
        <div className={classes.description}>{ `${bank.name} bank` }</div>
      </div>

      <div className={classes.counter}>
        <div>
          ${ position.size.times(bank.tokenPrice || 1).toFixed(0) }
          <Tooltip position="bottom-left">
            Collateral: <b>${ position.collateral.times(bank.tokenPrice || 1).toFixed(0) }</b>
          </Tooltip>
        </div>
        <p>Size</p>
      </div>

      <div className={classes.counter}>
        <p>{ position.leverage.toFixed(2) }</p>
        <p>Leverage</p>
      </div>

      <div className={classes.counter}>
        <div className={classNames({
          green: position.debtRatio.lt(33),
          orange: position.debtRatio.gte(33) && position.debtRatio.lt(85),
          red: position.debtRatio.gte(85)
        })}>
          { position.debtRatio.toFixed(2) }%
          <Tooltip position="bottom-left">
            <div className={classes.tooltipContent}>
              <p>Liquidation Leverage: <b>{ pool?.deathLeverage.toFixed(2) }</b></p>
              <p>When the debt ratio will reach 100%<br />the position will be liquidated</p>
            </div>
          </Tooltip>
        </div>
        <p>Debt Ratio</p>
      </div>

      <div className={classes.controls}>
        {isOwnPosition && (
          <>
            {! isClosePending && (
              <AdjustPosition
                position={position}
                pool={pool}
                bank={bank}
              />
            )}

            <button
              className={classes.controlsButton}
              onClick={onCloseButton}
              disabled={isClosePending}
            >
              {! isClosePending
                ? 'Close'
                : <Spinner color="bright" />}
            </button>
          </>
        )}

        {! isOwnPosition && (
          <button
            className={classes.controlsButton + (! canBeLiquidated ? ' disabled' : '')}
            onClick={onLiquidateButton}
            disabled={! canBeLiquidated || isLiquidatePending}
          >
            {! isLiquidatePending
              ? 'Liquidate'
              : <Spinner color="bright" />}
          </button>
        )}
      </div>
    </div>
  );
}