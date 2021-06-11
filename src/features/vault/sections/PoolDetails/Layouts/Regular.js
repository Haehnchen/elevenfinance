import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { formatDecimals } from 'features/helpers/bignumber';

import Grid from '@material-ui/core/Grid';

import DepositButton from '../Buttons/DepositButton';
import WithdrawButton from '../Buttons/WithdrawButton';
import PoolDescription from '../PoolDescription/PoolDescription';

import styles from './styles';
const useStyles = createUseStyles(styles);

const Regular = ({ pool, index, tokenBalance, depositedBalance }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12}>
        <div className={classes.divider}></div>
      </Grid>

      {/* Deposit Section */}
      <Grid item xs={12} sm={6} md={3}>
        <div className={classes.detailsSection + ' without-steps'}>
          <div className={classes.balance}>{formatDecimals(tokenBalance)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${tokenBalance.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Balance')}</div>

          {!pool.isDiscontinued && (
            <DepositButton pool={pool} index={index} balance={tokenBalance} />
          )}
        </div>
      </Grid>

      {/* Withdraw Section */}
      <Grid item xs={12} sm={6} md={3}>
        <div className={classes.detailsSection + ' without-steps'}>
          <div className={classes.balance}>{formatDecimals(depositedBalance, pool.tokenDecimals)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${depositedBalance.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Deposited')}</div>

          <WithdrawButton pool={pool} index={index} balance={depositedBalance} />
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <PoolDescription pool={pool} />
      </Grid>
    </>
  );
};

export default Regular;