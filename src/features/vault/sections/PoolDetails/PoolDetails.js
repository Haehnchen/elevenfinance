import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import BigNumber from 'bignumber.js';
import { formatDecimals } from 'features/helpers/bignumber';

import Grid from '@material-ui/core/Grid';

import DepositButton from './DepositButton';
import FarmClaimButton from './FarmClaimButton';
import StakeButton from './StakeButton';
import UnstakeButton from './UnstakeButton';
import WithdrawButton from './WithdrawButton';

import styles from './styles';
const useStyles = makeStyles(styles);

const PoolDetails = ({ pool, index, balanceSingle, sharesBalance, pendingRewards }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [depositedAmount, setDepositedAmount] = useState(new BigNumber(0));
  const [stakedAmount, setStakedAmount] = useState(new BigNumber(0));

  useEffect(() => {
    if (pool.pricePerFullShare) {
      const pricePerShare = new BigNumber(pool.pricePerFullShare);

      if (sharesBalance) {
        setDepositedAmount(sharesBalance.times(pricePerShare));
      }

      if (pool.stakedAmount) {
        setStakedAmount(pool.stakedAmount.times(pricePerShare));
      }
    }
  }, [pool, sharesBalance]);

  return (
    <Grid item container xs={12} className={classes.poolDetails}>
      <div className={classes.farmStepsLine}></div>
      {/* Deposited Balance */}
      <Grid item xs={12} sm={6} lg={3}>
        <div className={classes.step}>
          <span className={classes.stepLine}></span>
          <span className={classes.stepBg}></span>
          <span className={classes.stepNumber}>1</span>
          <span className={classes.stepLabel}>Deposit to Vault</span>
        </div>

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
      <Grid item xs={12} sm={6} lg={3}>
        <div className={classes.step}>
          <span className={classes.stepLine}></span>
          <span className={classes.stepBg}></span>
          <span className={classes.stepNumber}>2</span>
          <span className={classes.stepLabel}>Stake in Farm</span>
        </div>

        <div className={classes.detailsSection}>
          <div className={classes.balance}>{formatDecimals(depositedAmount)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${depositedAmount.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Deposited')}</div>

          <StakeButton pool={pool} index={index} balance={depositedAmount} />&nbsp;&nbsp;
          <WithdrawButton pool={pool} index={index} balance={depositedAmount} />
        </div>
      </Grid>

      {/* Deposited Balance */}
      <Grid item xs={12} sm={6} lg={3}>
        <div className={classes.step}>
          <span className={classes.stepLine}></span>
        </div>

        <div className={classes.detailsSection}>
          <div className={classes.balance}>{formatDecimals(stakedAmount)}</div>
          {pool.price && (
            <div className={classes.balanceSecondary}>${stakedAmount.times(pool.price).toFixed(2)}</div>
          )}
          <div className={classes.balanceDescription}>{t('Vault-Staked')}</div>

          <UnstakeButton pool={pool} index={index} balance={stakedAmount} />
        </div>
      </Grid>

      {/* Farm Earnings */}
      <Grid item xs={12} lg={3}>
        <div className={classes.step}>
          <span className={classes.stepLine}></span>
          <span className={classes.stepBg}></span>
          <span className={classes.stepNumber}>3</span>
          <span className={classes.stepLabel}>Harvest the Rewards</span>
        </div>

        <div className={classes.detailsSection}>
          <div className={classes.balanceWithLogo + (pool.price ? ' ' + classes.balanceWithPadding : '')}>
            <div className={classes.balanceLogo}>
              <img src={require(`images/${pool.farm.earnedToken}-logo.png`)}/>
            </div>
            <div>
              <div className={classes.balance}>{formatDecimals(pendingRewards?.pendingEle)}</div>
              <div className={classes.balanceDescription}>{t('Farm-Earned')} {pool.farm.earnedToken}</div>
            </div>
          </div>

          <FarmClaimButton pool={pool} />
        </div>
      </Grid>
    </Grid>
  );
}

export default PoolDetails;