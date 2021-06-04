import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';

import Tooltip from 'components/Tooltip/Tooltip';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Position({ position, bank, pool }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.nameBlock}>
        <div className={classes.name}>{ pool.name }</div>
        <div className={classes.description}>{ `${position.bankId} bank` }</div>
      </div>
      <div className={classes.counter}>
        <div>
          ${ position.size.times(bank.tokenPrice || 1).toFixed(0) }
          <Tooltip>Collateral: <b>${ position.collateral.times(bank.tokenPrice || 1).toFixed(0) }</b></Tooltip>
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
            Death Leverage: <b>{ pool?.deathLeverage.toFixed(2) }</b>
          </Tooltip>
        </div>
        <p>Debt Ratio</p>
      </div>
    </div>
  );
}