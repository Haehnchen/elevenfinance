import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { formatDecimals } from 'features/helpers/bignumber';

import Grid from '@material-ui/core/Grid';

import ClaimButton from '../Buttons/ClaimButton';
import DepositButton from '../Buttons/DepositButton';
import WithdrawButton from '../Buttons/WithdrawButton';
import Step from './Step/Step';

import styles from './styles';
const useStyles = makeStyles(styles);

const Claimable = ({ pool, index, balanceSingle, depositedAmount, pendingRewards }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      {/* Deposited Balance */}
      <Grid item xs={12} sm={6} md={3}>
        <Step number={1} label={'Deposit to Vault'} />

        <div className={classes.detailsSection}>
          <div className={classes.balance}>{formatDecimals(balanceSingle)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${balanceSingle.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Balance')}</div>

          <DepositButton pool={pool} index={index} balance={balanceSingle} />
        </div>
      </Grid>

      {/* Deposited Tokens */}
      <Grid item xs={12} sm={6} md={3}>
        <Step />

        <div className={classes.detailsSection}>
          <div className={classes.balance}>{formatDecimals(depositedAmount)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${depositedAmount.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Deposited')}</div>

          <WithdrawButton pool={pool} index={index} balance={depositedAmount} />
        </div>
      </Grid>

      {/* Farm Earnings */}
      <Grid item xs={12} md={6}>
        <Step number={2} label={'Harvest the Rewards'} />

        <div className={classes.detailsSection}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <div className={classes.balanceWithLogo + (pool.price ? ' ' + classes.balanceWithPadding : '')}>
                <div className={classes.balanceLogo}>
                  <img src={require(`images/ELE-logo.png`)}/>
                </div>
                <div>
                  <div className={classes.balance}>{formatDecimals(pendingRewards?.pendingEle)}</div>
                  <div className={classes.balanceDescription}>{t('Vault-Earned')} ELE</div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className={classes.balanceWithLogo + (pool.price ? ' ' + classes.balanceWithPadding : '')}>
                <div className={classes.balanceLogo}>
                  <img src={require(`images/${pool.claimableToken}-logo.svg`)}/>
                </div>
                <div>
                  <div className={classes.balance}>{formatDecimals(pendingRewards?.pendingToken)}</div>
                  <div className={classes.balanceDescription}>{t('Vault-Earned')} {pool.claimableToken}</div>
                </div>
              </div>
            </Grid>
          </Grid>

          <ClaimButton pool={pool} />
        </div>
      </Grid>
    </>
  );
};

export default Claimable;