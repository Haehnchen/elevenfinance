import React from 'react';
import { createUseStyles } from 'react-jss';
import millify from 'millify';
import { formatDecimals } from 'features/helpers/bignumber';

import { networks } from 'features/configure';

import Loader from 'components/Loader/Loader';

import styles from './styles';
const useStyles = createUseStyles(styles);

const PoolSummary = ({ pool, tokenBalance, depositedBalance, fetchBalanceDone, isActiveNetwork, onClick }) => {
  const classes = useStyles();

  const units = ['', 'K', 'M', 'B', 'T', 'Q', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion',
    'Decillion', 'Undecillion'];

  const poolNetwork = networks.find(network => pool.network == network.name);
  const isCompounding = pool.earnContractAddress && ( ! pool.claimable || pool.id == 'bfusd');

  const getApy = pool => {
    if (pool.apy === undefined) {
      return "";
    }

    const vaultApy = pool.apy;
    try {
      return millify(vaultApy, { units });
    } catch {
      return Number.parseFloat(vaultApy).toExponential(2);
    }
  }

  const getAprd = pool => {
    const vaultAprd = isCompounding
      ? pool.aprd
      : pool.apy / 365;

    if (vaultAprd === undefined || isNaN(vaultAprd)) {
      return "";
    }

    try {
      return millify(vaultAprd, { units });
    } catch {
      return "--"
    }
  }

  return (
    <>
      {pool.isDiscontinued && (
        <div className={classes.discontinuedMessage}>
          <span>Discontinued</span>

          { pool.discontinuedMessage || '' }
        </div>
      )}

      <div className={classes.poolSummary + (pool.isDiscontinued ? ' discontinued' : '')} onClick={onClick}>
        <div className={classes.poolInfo}>
          <div className={classes.logo}>
            <img src={require(`../../../../images/${pool.image || pool.token + '-logo.svg'}`)} />
          </div>

          <div className={classes.nameBlock}>
            <p className={classes.name}>{pool.token}</p>
            <p className={classes.description}>{pool.uses}</p>
          </div>
        </div>

        {isActiveNetwork && (
          <>
            <div className={classes.counter}>
              <p>
                { fetchBalanceDone
                  ? formatDecimals(tokenBalance)
                  : (<Loader />) }
              </p>
              <p>Balance</p>
            </div>

            <div className={classes.counter}>
              <p>
                { depositedBalance !== null
                  ? formatDecimals(depositedBalance)
                  : (<Loader />)}
              </p>
              <p>Deposited</p>
            </div>
          </>
        )}

        {! isActiveNetwork && (
          <div className={classes.networkSwitch}>
            Available on

            {poolNetwork && (
              <div className={classes.networkName}>
                <img src={require(`assets/img/networks/${poolNetwork.image}`)} />
                { poolNetwork.label }
              </div>
            )}
          </div>
        )}

        <div className={classes.counter}>
          <p>{ getApy(pool) }%</p>
          <p>{ isCompounding ? 'APY' : 'APR' }</p>
        </div>

        <div className={classes.counter}>
          <p>{ getAprd(pool) }%</p>
          <p>APRD</p>
        </div>

        <div className={classes.counter}>
          <p>{ pool.tvl ? '$' + millify(pool.tvl, { units }) : '-' }</p>
          <p>TVL</p>
        </div>
      </div>
    </>
  );

};

export default PoolSummary;