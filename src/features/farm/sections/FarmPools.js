import React, { useState, useEffect } from 'react';
import classNames from "classnames";
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import farmItemStyle from "../jss/sections/farmItemStyle";
import Button from "components/CustomButtons/Button.js";
import { useFetchPoolsInfo, useFetchPoolsBalances, useFetchWithdraw } from '../redux/hooks';
import { useConnectWallet } from '../../home/redux/hooks';

import millify from 'millify';

import {
  Avatar,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const useStyles = makeStyles(farmItemStyle);

export default () => {
  const classes = useStyles();
  const { t } = useTranslation();
  let { pools } = useFetchPoolsInfo();
  const { fetchPoolsBalances, fetchPoolsBalancesDone } = useFetchPoolsBalances();
  const { web3, address, networkId } = useConnectWallet();
  const { fetchWithdraw, fetchWithdrawPending } = useFetchWithdraw();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortTerm, setSortTerm] = useState('default');
  const [onlyStakedPools, setOnlyStakedPools] = useState(false);
  const [onlyWithBalancePools, setOnlyWithBalancePools] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [normalizedData, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await fetch("https://eleven.finance/api.json");
    const json = await response.json();

    let normalizedData = pools.map((pool, index) => {
      let name = pool.name;

      if (name === "ELE-BNB LP" || name === "ELE-BNB LP V2") {
        let apy = json[name]["apy"];
        pool["farm"] = { apy: apy };
        return pool;
      } else if (name !== undefined) {
        let farm = json[name]?.farm || { aprd: 0, apy: 0, aprl: 0};
        pool["farm"] = farm;
        return pool;
      }
    })

    normalizedData = pools.map((pool) => {
      if (pool.farm.apy === undefined || pool.farm.apy == null) {
        pool.farm["apy"] = 0;
      }

      if (pool.farm.aprd === undefined || pool.farm.aprd == null) {
        pool.farm["aprd"] = 0;
      }

      if (pool.farm.aprl === undefined || pool.farm.aprl == null) {
        pool.farm["aprl"] = 0;
      }

      return pool;
    })

    setData(normalizedData);
  }

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    let results = pools.filter(pool =>
      pool.token.toLowerCase().includes(term)
    );

    // Hide all V1-farms with zero balance from list
    results = results.filter(pool => {
      return ! pool.isV1
        || (pool.stakedAmount && pool.stakedAmount.gt(0));
    });

    if (onlyStakedPools) {
      results = results.filter(pool => pool.stakedAmount && pool.stakedAmount.gt(0));
    }

    if (onlyWithBalancePools) {
      results = results.filter(pool => {
        return (pool.userTokenBalance && pool.userTokenBalance.gt(0))
          || (pool.stakedAmount && pool.stakedAmount.gt(0))
      });
    }

    switch (sortTerm) {
      case 'apy':
        results = _.orderBy(results, 'farm.apy', 'desc');
        break;
      case 'aprl':
        results = _.orderBy(results, 'farm.aprl', 'desc');
        break;
    }

    // Put all V1 pools in top of the list
    results = _.orderBy(results, 'isV1', 'asc');

    setSearchResults(results);
  }, [searchTerm, sortTerm, onlyStakedPools, onlyWithBalancePools, fetchPoolsBalancesDone, pools])

  const units = ["", "K", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion", "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion"];

  const farmApy = pool => {
    if (pool.isV1) {
      return 0;
    }

    if (pool.farm === undefined || pool.farm.apy === undefined || pool.farm.apy === null) {
      return '--'
    } else {
      const farmApy = pool.farm.apy;
      try{
        return millify(farmApy, { units, precision: 2 })
      }catch{
        return Number.parseFloat(farmApy).toExponential(2);
      }
    }
  }

  const farmAprd = pool => {
    if (pool.isV1) {
      return 0;
    }

    if (pool.farm === undefined || pool.farm.aprl === undefined || pool.farm.aprd === null) {
      return '--'
    } else {
      const farmAprd = pool.farm.aprd;
      return millify(farmAprd, { units, precision: 2 })
    }
  }

  const farmAprl = pool => {
    if (pool.isV1) {
      return 0;
    }

    if (pool.farm === undefined || pool.farm.aprl === undefined || pool.farm.aprl === null) {
      return '--'
    } else {
      const farmAprl = pool.farm.aprl;
      try{
          return millify(farmAprl, { units, precision: 2 })
      }catch{
          return "--"
      }
    }
  }

  useEffect(() => {
    const fetch = () => {
      if (address && web3) {
        fetchPoolsBalances({ address, web3, pools })
      }
    };
    fetch();

    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, [address, web3]);

  const handleWithdrawAll = (pool, index) => {
    const amount = new BigNumber(pool.stakedAmount)
      .multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals))
      .toString(10);

    fetchWithdraw(pool.id - 1, amount);
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

  const offsetImageStyle = { marginLeft: "-25%", zIndex: 0, background: '#ffffff' }
  return (
    <Grid container style={{ paddingTop: '4px' }}>
      <Grid item xs={12}>
        <div className={classes.mainTitle}>{t('Farm-Main-Title')}</div>
        <h3 className={classes.subTitle} style={{ color: 'white' }}>{t('Farm-Second-Title')}</h3>
      </Grid>

      <Grid item container className={classes.filtersContainer} xs={12}>
        <Grid item md={6} className={classes.filtersLeft}>
          <FormControlLabel
            control={
              <Checkbox checked={onlyStakedPools}
                        onChange={handleOnlyStakedPools}
                        name="only_staked_pools" />
            }
            label="Staked Only"
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
              <MenuItem value="aprl">ELE APR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container item xs={12} justify={"center"}>
        {searchResults.map((pool, index) => {
          const { id, token, name, earnedToken, earnedTokenAddress, color, tokenDescription, token1, token2 } = pool;

          // 根据名称是否含有LP判断是否是存 LPToken对
          const isLP = name.toLowerCase().indexOf('lp') > -1;

          const lpTokens = isLP ? token.split('/') : [];

          return (
            <Grid item xs={12} sm={6} key={index}>
              <div style={{ background: `#2D3140` }} className={classNames({
                [classes.flexColumnCenter]: true,
                [classes.farmItem]: true
              })} key={index}>
                {pool.isV1 && (
                  <div className={classes.poolWarning}>Migration to V2 pool is required</div>
                )}

                {/*Logo处理*/}
                {isLP && lpTokens.length === 2 ? (
                  <div className={classes.logo}>
                    {lpTokens.map((item, index) => {
                      return (
                        <Avatar key={index}
                          src={require(`../../../images/${pool.isV1 && item.indexOf('old') === 0 ? item.slice(3) : item}-logo.svg`)} className={classes.logoImage}
                          style={index > 0 ? offsetImageStyle : {}}
                        />
                      )
                    })}
                  </div>
                ) : <img src={require(`../../../images/${pool.isV1 && token.indexOf('old') === 0 ? token.slice(3) : token}-logo.svg`)} className={classes.logoImage} />}
                <div className={classes.weightFont} style={{ marginTop: 10 }}>{token}</div>

                <div style={{ fontSize: 13 }}>
                  {t('Farm-Stake')} {tokenDescription}
                </div>
                <div style={{ fontSize: 13, marginTop: -5 }}>{t('Farm-Earn')} {earnedToken}</div>

                {token == "ELE-BNB LP" || token == "ELE-BNB LP V2" ? (
                  <div>
                    <div className={classes.weightFont} style={{ margin: 15 }}>APR: <span>{farmApy(pool)}</span>%</div>
                    <div>x60 weight</div>
                    <div>Deposit LP and get boosted rewards</div>
                  </div>
                ) : (
                  <div>
                    <div className={classes.weightFont} style={{ margin: 15 }}>APY: {farmApy(pool)}%</div>
                    <div>Vault APR/Day: {farmAprd(pool)}%</div>
                    <div>ELE APR: {farmAprl(pool)}%</div>
                  </div>
                )}

                {/*操作菜单*/}
                {!pool.isV1 && (
                  <div className={classes.menu} style={isLP ? {} : { justifyContent: 'center' }}>
                    {isLP ? (
                      <>
                        <Button className={classes.menuButton}
                          href={`/#/farm/pool/${id}`}
                          style={{ background: `#635AFF` }}>
                          {t('Farm-Mining')}
                        </Button>
                        <Button
                          className={classes.menuButton}
                          href={`https://exchange.pancakeswap.finance/#/add/${token1}/${token2}`}
                          target={"_blank"}
                          style={{ background: `#FF635A` }}>
                          {t('Farm-Get')} LP Token
                        </Button>
                      </>
                    ) : <Button
                      className={classes.menuButton}
                      href={`/#/farm/pool/${id}`}
                      style={{ background: `#635AFF` }}>{t('Farm-Mining')}</Button>}
                  </div>
                )}

                {pool.isV1 && (
                  <Button
                    onClick={handleWithdrawAll.bind(this, pool, index)}
                    className={classes.menuButton}
                    style={{ background: `#FF635A` }}
                  >
                    {!fetchWithdrawPending[pool.id - 1] ? `${t('Vault-WithdrawButtonAll')}` : (
                      <CircularProgress
                        className={classes.buttonLoader}
                        size={20}
                        thickness={6} />
                    )}
                  </Button>
                )}
              </div>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}
