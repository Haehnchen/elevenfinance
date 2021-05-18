import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { byDecimals, formatDecimals } from 'features/helpers/bignumber';

import Grid from '@material-ui/core/Grid';
import Loader from 'components/Loader/Loader';
import Select from 'components/Select/Select';

import { CashIcon } from '@heroicons/react/outline';

import ClaimButton from '../Buttons/ClaimButton';
import DepositButton from '../Buttons/DepositButton';
import WithdrawButton from '../Buttons/WithdrawButton';
import Step from './Step/Step';

import styles from './styles';
const useStyles = createUseStyles(styles);

const BigfootUsd = ({ pool, index, tokens, depositedBalance, pendingRewards, pendingRewardsLoaded }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [displayDepositedIn, setDisplayDepositedIn] = useState(pool.tokens[0].token);

  const displayDepositedOptions = pool.tokens.map(token => ({value: token.token, name: token.token}));

  return (
    <>
      {/* Tokens Balances */}
      <Grid item xs={12} sm={6} md={6}>
        <Step number={1} label={'Deposit to Bank'} />

        <div className={classes.detailsSection}>
          <Grid container>
            {pool.tokens.map(token => {
              return (
                <Grid item key={token.token} xs={12} sm={6}>
                  <div className={classes.balanceWithLogo + (pool.price ? ' ' + classes.balanceWithPadding : '')}>
                    {/* <div className={classes.balanceLogo}>
                      <img src={require(`images/` + (token.image || (token.token + '-logo.svg')))}/>
                    </div> */}
                    <div>
                      <div className={classes.balance}>
                        { formatDecimals(byDecimals(tokens[token.token].tokenBalance, token.decimals)) }
                      </div>
                      <div className={classes.balanceDescription}>{ token.token + ' Balance'}</div>
                    </div>
                  </div>
                </Grid>
              )
            })}
          </Grid>

          {!pool.isDiscontinued && (
            <button className={classes.button}>
              Deposit
            </button>
          )}
        </div>
      </Grid>

      {/* Deposited Tokens */}
      <Grid item xs={12} sm={6} md={3}>
        <Step />

        <div className={classes.detailsSection}>
          <div className={classes.balanceDouble}>
            <div>
              <div className={classes.balance}>{formatDecimals(depositedBalance)}</div>
              <div className={classes.balanceDescription}>{t('Vault-Deposited')}</div>

              <Select
                options={displayDepositedOptions}
                selected={displayDepositedIn}
                onChange={setDisplayDepositedIn}
                icon={<CashIcon />}
                bgColor="dark"
                className={classes.balanceSelect}
              />
            </div>
          </div>

          <WithdrawButton pool={pool} index={index} balance={depositedBalance} />
        </div>
      </Grid>

      {/* Farm Earnings */}
      <Grid item xs={12} md={3}>
        <Step number={2} label={'Harvest the Rewards'} />

        <div className={classes.detailsSection}>
          <div className={classes.balanceWithLogo + (pool.price ? ' ' + classes.balanceWithPadding : '')}>
            <div className={classes.balanceLogo}>
              <img src={require(`images/ELE-logo.png`)}/>
            </div>
            <div>
              <div className={classes.balance}>
                {pendingRewardsLoaded
                  ? formatDecimals(pendingRewards?.pendingEle)
                  : (<Loader/>)
                }
              </div>
              <div className={classes.balanceDescription}>{t('Vault-Earned')} ELE</div>
            </div>
          </div>
          <div className={classes.balanceWithLogo + (pool.price ? ' ' + classes.balanceWithPadding : '')}>
            <div className={classes.balanceLogo}>
              <img src={require(`images/${pool.claimableToken}-logo.svg`)}/>
            </div>
            <div>
              <div className={classes.balance}>
                {pendingRewardsLoaded
                  ? formatDecimals(pendingRewards?.pendingToken)
                  : (<Loader/>)
                }
              </div>
              <div className={classes.balanceDescription}>{t('Vault-Earned')} {pool.claimableToken}</div>
            </div>
          </div>

          <ClaimButton pool={pool} />
        </div>
      </Grid>
    </>
  )
}

export default BigfootUsd;