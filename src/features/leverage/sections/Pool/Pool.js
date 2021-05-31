import React from 'react';
import { createUseStyles } from 'react-jss';

import Loader from 'components/Loader/Loader';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Pool({ bank, pool, fetchPoolsDataDone }) {
  const classes = useStyles();

  const getApr = () => {
    const levereage = 2.5; // TODO:
    const multiplier = (levereage - 1) * 2;

    const yieldFarming = (pool.aprd ?? 0) * 365 * levereage;
    const tradingFee = (pool.rates?.tradingFee ?? 0) * multiplier;
    const borrowApy = (bank?.baseBorrowApy ?? 0) * multiplier / 2;

    return Math.round((yieldFarming + tradingFee - borrowApy) * 100) / 100;
  }

  return (
    <div className={classes.pool}>
      <div className={classes.summary}>
        <div className={classes.poolInfo}>
          <div className={classes.logo + ' wide'}>
            <img src={require(`images/${pool.image}`)} />
          </div>

          <div className={classes.nameBlock}>
            <p className={classes.name}>{pool.name}</p>
            <p className={classes.description}>{`Uses ${pool.bank} bank`}</p>
          </div>
        </div>

        <div className={classes.counter}>
          <p>
            {fetchPoolsDataDone
              ? `${getApr()}%`
              : <Loader />
            }
          </p>
          <p>APR</p>
        </div>
      </div>
    </div>
  );
}