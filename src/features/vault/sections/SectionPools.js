/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import { byDecimals } from 'features/helpers/bignumber';
import classNames from 'classnames';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { primaryColor } from "assets/jss/material-kit-pro-react.js";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';

import SearchIcon from "@material-ui/icons/Search"

import { useConnectWallet } from '../../home/redux/hooks';
import { useFetchBalances, useFetchPoolBalances, useFetchContractApy, useFetchPoolsInfo, useFetchPendingRewards } from '../redux/hooks';

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";

import millify from 'millify';

import NumberFormat from 'react-number-format';

import _ from 'lodash';

const useStyles = makeStyles(sectionPoolsStyle);

import DepositSection from './PoolDetails/DepositSection/DepositSection';
import WithdrawSection from './PoolDetails/WithdrawSection/WithdrawSection';
import HarvestSection from './PoolDetails/HarvestSection/HarvestSection';

export default function SectionPools() {

  const nervePools = ['nrvETH', 'nrvBTC', '3NRV', 'NRVBUSD'];

  const { t, i18n } = useTranslation();
  const { web3, address, networkId } = useConnectWallet();
  let { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { categories } = useFetchPoolsInfo();
  const { tokens, fetchBalances } = useFetchBalances();
  const { pendingRewards, fetchPendingRewards } = useFetchPendingRewards();
  const [openedCardList, setOpenCardList] = useState([0]);
  const classes = useStyles();

  const { fetchContractApy } = useFetchContractApy();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortTerm, setSortTerm] = useState('default');
  const [onlyStakedPools, setOnlyStakedPools] = useState(false);
  const [onlyWithBalancePools, setOnlyWithBalancePools] = useState(false);
  const [filtersCategories, setFiltersCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetch("https://eleven.finance/api.json");
    const json = await response.json();

    const normalizedData = pools.map((pool) => {
      let token = pool.token;
      let vault = json[token]?.vault;
      let tvl = json[token]?.tvl;
      pool["vault"] = vault;
      pool["tvl"] = tvl;
      pool['price'] = json[token]?.price;
      return pool;
    });

    normalizedData["totalvaluelocked"] = json["totalvaluelocked"]

    setData(normalizedData);
  }

  useEffect(() => {
    if (pools[0].vault !== undefined) {
      setSearchResults(pools);
    }

    const term = searchTerm.toLowerCase()
    let results = pools.filter(pool =>
      pool.token.toLowerCase().includes(term)
    );

    if (onlyStakedPools) {
      results = results.filter(pool => tokens[pool.earnedToken]?.tokenBalance > 0);
    }

    if (onlyWithBalancePools) {
      results = results.filter(pool => {
        return tokens[pool.token]?.tokenBalance > 0
          || tokens[pool.earnedToken]?.tokenBalance > 0;
      });
    }

    if (filtersCategories.length) {
      results = results.filter(pool => {
        return _.intersection(pool.categories || [], filtersCategories).length > 0;
      });
    } else {
      // Show all pools without category or in categories active by default
      const defaultCategories = categories.filter(category => category.default).map(category => category.name);

      results = results.filter(pool => {
        return ! pool.categories?.length
          || _.intersection(pool.categories, defaultCategories).length > 0;
      });
    }

    switch (sortTerm) {
      case "apy":
        results = _.orderBy(results, 'vault.apy', 'desc');
        break;
      case "apd":
        results = _.orderBy(results, 'vault.aprd', 'desc');
        break;
      case "tvl":
        results = _.orderBy(results, 'tvl', 'desc');
        break;
    }

    setSearchResults(results);
  }, [searchTerm, sortTerm, onlyStakedPools, onlyWithBalancePools, filtersCategories, tokens])

  const openCard = id => {
    return setOpenCardList(
      openedCardList => {
        if (openedCardList.includes(id)) {
          return openedCardList.filter(item => item !== id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  }

  useEffect(() => {
    if (address && web3) {
      fetchBalances({ address, web3, tokens });
      fetchPoolBalances({ address, web3, pools });
      fetchPendingRewards({ address, web3, pools });

      const id = setInterval(() => {
        fetchBalances({ address, web3, tokens });
        fetchPoolBalances({ address, web3, pools });
        fetchPendingRewards({ address, web3, pools });
      }, 10000);
      return () => clearInterval(id);
    }
  }, [address, web3, fetchBalances, fetchPoolBalances]);

  useEffect(() => {
    fetchContractApy();
  }, [pools, fetchContractApy]);

  const forMat = number => {
    return new BigNumber(
      number
    ).multipliedBy(
      new BigNumber(1000000000000000)
    ).dividedToIntegerBy(
      new BigNumber(1)
    ).dividedBy(
      new BigNumber(1000000000000000)
    ).toNumber()
  }

  const isZh = Boolean((i18n.language == 'zh') || (i18n.language == 'zh-CN'));
  const units = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];

  const getApy = pool => {
    if (pool.vault === undefined) {
      return "";
    } else {
      const vaultApy = pool.vault.apy;
      try{
        return millify(vaultApy, { units, space: true });
      }catch{return Number.parseFloat(vaultApy).toExponential(2);}
    }
  }

  const getAprd = pool => {
    if (pool.vault === undefined) {
      return "";
    } else {
      const vaultAprd = pool.vault.aprd;
      try{
        return millify(vaultAprd, { units, space: true });
      }catch{return "--"}
    }
  }

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSort = event => {
    setSortTerm(event.target.value);
  }

  const handleOnlyStakedPools = event => {
    setOnlyStakedPools(event.target.checked);
  }

  const handleOnlyWithBalancePools = event => {
    setOnlyWithBalancePools(event.target.checked);
  }

  const handleFiltersCategory = category => {
    const selectedCategories = filtersCategories.slice();

    var index = selectedCategories.indexOf(category.name);
    if (index === -1) {
      selectedCategories.push(category.name);
    } else {
      selectedCategories.splice(index, 1);
    }

    setFiltersCategories(selectedCategories);
  }

  return (
    <Grid container style={{ paddingTop: '4px' }}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Vault-Main-Title')}</div>
        <h3 style={{color: 'white'}}>TVL: <NumberFormat value={data.totalvaluelocked} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /></h3>
      </Grid>

      {/* Categories */}
      <Grid item xs={12} className={classes.filtersChips}>
        {categories.map((category, index) => {
          return (
            <Chip key={index}
                  label={category.name}
                  onClick={() => handleFiltersCategory(category)}
                  className={classNames(
                    classes.filtersChip,
                    {
                      active: filtersCategories.includes(category.name),
                      inactive: category.default === false
                    }
                  )} />
          )
        })}
      </Grid>

      {/* Filters */}
      <Grid item container className={classes.filtersContainer} xs={12}>
        <Grid item md={6} className={classes.filtersLeft}>
          <FormControlLabel
            control={
              <Checkbox checked={onlyStakedPools}
                        onChange={handleOnlyStakedPools}
                        name="only_staked_pools" />
            }
            label="Deposited Only"
            className={classes.filtersCheckbox}
          />

          <FormControlLabel
            control={
              <Checkbox checked={onlyWithBalancePools}
                        onChange={handleOnlyWithBalancePools}
                        name="only_with_balance_pools" />
            }
            label="Hide Zero Balances"
            className={classes.filtersCheckbox}
          />
        </Grid>
        <Grid item md={6} className={classes.filtersRight}>
          <TextField
            onChange={handleSearchChange}
            className={classes.searchInput}
            placeholder="Search"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }} />

          <FormControl
            variant="outlined"
            className={classes.sortSelect}
          >
            <Select
              value={sortTerm}
              onChange={handleSort}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="apy">APY</MenuItem>
              <MenuItem value="tvl">TVL</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Pools */}
      {Boolean(networkId === Number(process.env.NETWORK_ID)) && searchResults.map((pool, index) => {
        let balanceSingle = byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals);
        let singleDepositedBalance = byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals);
        return (
          <Grid item xs={12} container key={index} style={{ marginBottom: "24px" }} spacing={0}>
            <div style={{ width: "100%" }}>
              <Accordion
                expanded={Boolean(openedCardList.includes(index))}
                className={classes.accordion}
                TransitionProps={{ unmountOnExit: true }}
              >
                <AccordionSummary
                  className={classes.details}
                  style={{ justifyContent: "space-between" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    openCard(index)
                  }}
                >
                  <Grid container alignItems="center" justify="space-around" spacing={4} style={{ paddingTop: "16px", paddingBottom: "16px" }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Grid item container alignItems="center" xs={12} spacing={2}>
                        <Grid item>
                          <Avatar alt={pool.token} src={require(`../../../images/${pool.token}-logo.svg`)} />
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
                            <Grid item style={{ width: "200px" }}>
                              <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' || pool.token == 'ASR-BNB LP' || pool.token == 'ATM-BNB LP' ? forMat(balanceSingle) : forMat(balanceSingle).toFixed(6)} {pool.token}</Typography>
                              <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Balance')}</Typography></Grid>
                          </Grid>
                        </Hidden>
                        <Hidden mdDown>
                          <Grid item xs={4} container alignItems="center">
                            <Grid item style={{ width: "200px" }}>
                              <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>{pool.token == 'OG-BNB LP' || pool.token == 'PSG-BNB LP' || pool.token == 'JUV-BNB LP' ? forMat(singleDepositedBalance) : forMat(singleDepositedBalance).toFixed(6)} {pool.earnedToken}</Typography>
                              <Typography className={classes.iconContainerSubTitle} variant="body2">{t('Vault-Deposited')}</Typography>
                            </Grid>
                          </Grid>
                        </Hidden>
                        <Grid item xs={12} md={3} container alignItems="center">
                          <Grid item>
                            <Typography className={classes.iconContainerMainTitle} variant="body2" gutterBottom noWrap>
                              <span>{nervePools.includes(pool.name) ? "APR" : "APY" }: {getApy(pool)} %</span>
                            </Typography>
                            <Typography className={classes.iconContainerSubTitle} variant="body2">
                              <span>{nervePools.includes(pool.name) ? "ELE APR" : "APRD" }: {getAprd(pool)} %</span>
                            </Typography>
                          </Grid>
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
                            onClick={(event) => {
                              event.stopPropagation();
                              openCard(index);
                            }}
                          >
                            {
                              openedCardList.includes(index) ? <i className={"yfiiicon yfii-arrow-up"} /> : <i className={"yfiiicon yfii-arrow-down"} />
                            }
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails style={{ justifyContent: "space-between" }}>
                  <Grid container style={{ width: "100%", marginLeft: 0, marginRight: 0 }}>
                    <DepositSection pool={pool} index={index} balanceSingle={balanceSingle}/>
                    <WithdrawSection pool={pool} index={index} sharesBalance={singleDepositedBalance} />

                    {pool.claimable && (
                      <HarvestSection pool={pool} index={index} pendingRewards={pendingRewards[pool.id]} />
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </div>
          </Grid>
        )
      })}
    </Grid>
  )
}
