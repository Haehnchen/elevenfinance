import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import millify from 'millify';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';
import { primaryColor } from "assets/jss/material-kit-pro-react.js";
import { byDecimals, forMat, formatDecimals } from 'features/helpers/bignumber';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import PoolDetails from '../PoolDetails/PoolDetails';

import styles from './styles';
const useStyles = makeStyles(styles);

const Pool = ({ pool, index, tokens, fetchPoolBalancesDone }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(new BigNumber(0));
  const [depositedBalance, setDepositedBalance] = useState(new BigNumber(0));
  const [depositedAndStaked, setDepositedAndStaked] = useState(new BigNumber(0));
  const isZh = Boolean((i18n.language == 'zh') || (i18n.language == 'zh-CN'));

  const toggleCard = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  useEffect(() => {
    if (tokens[pool.token]) {
      setTokenBalance(byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals));
    }

    if (fetchPoolBalancesDone) {
      const depositedBalance = pool.earnContractAddress
        ? byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals).times(pool.pricePerFullShare)
        : new BigNumber(0);

      const stakedBalance = (pool.stakedAmount || new BigNumber(0)).times(pool.pricePerFullShare);

      setDepositedBalance(depositedBalance);
      setDepositedAndStaked(depositedBalance.plus(stakedBalance));

      if (pool.id == 'ELE') {
        console.info(pool.pricePerFullShare + ' ' + depositedBalance + ' ' + stakedBalance);
      }
    }
  }, [tokens, pool, fetchPoolBalancesDone])

  const depositedLabels = [
    pool.earnContractAddress ? 'Deposited' : null,
    pool.farm ? 'Staked' : null
  ];

  const units = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];

  const getApy = pool => {
    const stats = pool.claimable
      ? pool.vault
      : pool.farmStats;

    if (stats === undefined) {
      return "";
    }

    const vaultApy = stats.apy;
    try {
      return millify(vaultApy, { units, space: true });
    } catch {
      return Number.parseFloat(vaultApy).toExponential(2);
    }
  }

  const getAprd = pool => {
    const stats = pool.claimable
      ? pool.vault
      : pool.farmStats;

    if (stats === undefined) {
      return "";
    }

    const vaultAprd = stats.aprd;
    try {
      return millify(vaultAprd, { units, space: true });
    } catch {
      return "--"
    }
  }

  const getEleApr = pool => {
    if (pool.farmStats === undefined) {
      return "";
    }

    const eleApr = pool.farmStats.aprl;
    try {
      return millify(eleApr, { units, space: true });
    } catch {
      return '--'
    }
  }

  return (
    <Grid item xs={12} container key={index} style={{ marginBottom: "24px" }} spacing={0}>
      <div style={{ width: "100%" }}>
        <Accordion
          expanded={isOpen}
          className={classes.accordion}
          TransitionProps={{ unmountOnExit: true }}
        >
          <AccordionSummary
            className={classes.details}
            style={{ justifyContent: "space-between" }}
            onClick={toggleCard}
          >
            <Grid container alignItems="center" justify="space-around" spacing={4} style={{ paddingTop: "16px", paddingBottom: "16px" }}>
              <Grid item xs={12} sm={6} md={3}>
                <Grid item container alignItems="center" xs={12} spacing={2}>
                  <Grid item>
                    <Avatar alt={pool.token} src={require(`../../../../images/${pool.token}-logo.svg`)} />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom>
                      {pool.token}
                      <Hidden smUp>
                        <i
                          style={{ color: primaryColor[0], marginLeft: '4px', visibility: Boolean(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl) ? "visible" : "hidden" }}
                          className={"yfiiicon yfii-help-circle"}
                          onClick={
                            event => {
                              event.stopPropagation();
                              window.open(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl)
                            }
                          }
                        />
                      </Hidden>
                    </Typography>
                    {typeof pool.tvl !== 'undefined' ? (
                      <Typography className={classes.poolTvl} variant="body2">TVL: <NumberFormat value={pool.tvl} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /> </Typography>
                    ) : (
                      <Typography className={classes.poolTvl} variant="body2">--</Typography>
                    )}
                    <Typography className={classes.iconContainerSubTitle} variant="body2">{pool.uses}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} sm={4} md={8}>
                <Grid item container justify="space-between">
                  <Hidden smDown>
                    <Grid item xs={5} container alignItems="center">
                      <Grid item className={isOpen ? classes.hidden : ''} style={{ width: "200px" }}>
                        <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' || pool.token == 'ASR-BNB LP' || pool.token == 'ATM-BNB LP' ? forMat(tokenBalance) : forMat(tokenBalance).toFixed(6)}</Typography>
                        <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Balance')}</Typography>
                      </Grid>
                    </Grid>
                  </Hidden>
                  <Hidden mdDown>
                    <Grid item xs={4} container alignItems="center">
                      <Grid item className={isOpen ? classes.hidden : ''} style={{ width: "200px" }}>
                        <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' ? forMat(depositedAndStaked) : forMat(depositedAndStaked).toFixed(6)}</Typography>
                        <Typography className={classes.iconContainerSubTitle} variant="body2">{depositedLabels.filter(label => !! label).join(' + ')}</Typography>
                      </Grid>
                    </Grid>
                  </Hidden>
                  <Grid item xs={12} md={3} container alignItems="center">
                    {pool.earnContractAddress && (
                      <Grid item>
                        <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>
                          <span>{pool.claimable ? "APR" : "APY" }: {getApy(pool)} %</span>
                        </Typography>
                        <Typography className={classes.iconContainerSubTitle} variant="body2">
                          <span>{pool.claimable ? "ELE APR" : "APRD" }: {getAprd(pool)} %</span>
                        </Typography>
                        {!pool.claimable && (
                          <Typography className={classes.iconContainerSubTitle} variant="body2" style={{paddingTop: 5}}>
                            <span>ELE APR: {getEleApr(pool)} %</span>
                          </Typography>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} sm={2} md={1}>
                <Grid item container justify="flex-end" alignItems="center" spacing={2}>
                  <Hidden xsUp>
                    <Grid item>
                      <IconButton
                        classes={{
                          root: classes.iconContainerSecond
                        }}
                        style={{ visibility: Boolean(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl) ? "visible" : "hidden" }}
                        onClick={
                          event => {
                            event.stopPropagation();
                            window.open(isZh ? pool.tokenDescriptionUrl2 : pool.tokenDescriptionUrl)
                          }
                        }
                      >
                        <i className={"yfiiicon yfii-help-circle"} />
                      </IconButton>
                    </Grid>
                  </Hidden>
                  <Grid item>
                    <IconButton
                      className={classes.iconContainerPrimary}
                      onClick={toggleCard}
                    >
                      {
                        isOpen ? <i className={"yfiiicon yfii-arrow-up"} /> : <i className={"yfiiicon yfii-arrow-down"} />
                      }
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <PoolDetails pool={pool}
                index={index}
                balanceSingle={tokenBalance}
                sharesBalance={depositedBalance} />
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
    </Grid>
  );
};

export default Pool;