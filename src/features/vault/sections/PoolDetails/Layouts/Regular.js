import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { formatDecimals } from 'features/helpers/bignumber';

import Grid from '@material-ui/core/Grid';

import DepositButton from '../Buttons/DepositButton';
import WithdrawButton from '../Buttons/WithdrawButton';

import styles from './styles';
const useStyles = createUseStyles(styles);

const Regular = ({ pool, index, tokenBalance, depositedBalance, pendingRewards, pendingRewardsLoaded }) => {
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
          <div className={classes.balance}>{formatDecimals(depositedBalance)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${depositedBalance.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Deposited')}</div>

          <WithdrawButton pool={pool} index={index} balance={depositedBalance} />
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <div className={classes.statsSection}>
          {pool.fees && (
            <div>
              <div className="item">
                <span>Deposit fee</span>
                <span>{ pool.fees.deposit ? pool.fees.deposit + '% on capital' : 'none' }</span>
              </div>
              <div className="item">
                <span>Withdrawal fee</span>
                <span>{ pool.fees.withdrawal ? pool.fees.withdrawal + '% on capital' : 'none' }</span>
              </div>
              <div className="item">
                <span>Controller fee</span>
                <span>{ pool.fees.controller ? pool.fees.controller + '% on profits' : 'none' }</span>
              </div>
              <div className="item">
                <span>Platform fee</span>
                <span>{ pool.fees.platform ? pool.fees.platform + '% on profits' : 'none' }</span>
              </div>
              <div className="item">
                <span>ELE buyback burn</span>
                <span>{ pool.fees.buybacks ? pool.fees.buybacks + '% on profits' : 'none' }</span>
              </div>

              {pool.fees.waultx_burn && (
                <div className="item">
                  <span>WAULTx burn</span>
                  <span>{ pool.fees.waultx_burn + '% on profits' }</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Grid>
    </>
  );
};

export default Regular;