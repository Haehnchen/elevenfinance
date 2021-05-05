/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

import SearchIcon from "@material-ui/icons/Search"

import { useConnectWallet } from '../../home/redux/hooks';
import {
  useFetchBalances,
  useFetchPoolBalances,
  useFetchPoolsInfo,
  useFetchFarmsStaked
} from '../redux/hooks';

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";

import NumberFormat from 'react-number-format';

import _ from 'lodash';

const useStyles = makeStyles(sectionPoolsStyle);

import Pool from './Pool/Pool';

export default function SectionPools({ filtersCategory }) {
  const { t } = useTranslation();
  const classes = useStyles();

  const { web3, address, networkId } = useConnectWallet();
  let { pools, fetchPoolBalances, fetchPoolBalancesDone } = useFetchPoolBalances();
  const { categories } = useFetchPoolsInfo();
  const { tokens, fetchBalances, fetchBalancesDone } = useFetchBalances();
  const { fetchFarmsStaked, fetchFarmsStakedDone } = useFetchFarmsStaked();

  const [fetchPoolDataDone, setFetchPoolDataDone] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortTerm, setSortTerm] = useState('default');
  const [onlyStakedPools, setOnlyStakedPools] = useState(false);
  const [onlyWithBalancePools, setOnlyWithBalancePools] = useState(false);
  const [filtersCategories, setFiltersCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (filtersCategory) {
      categories.forEach(category => {
        if (category.name.toLowerCase() == filtersCategory.toLowerCase()) {
          setFiltersCategories([category.name]);
        }
      })
    }

    loadData();
  }, []);

  useEffect(() => {
    if (fetchPoolBalancesDone && fetchFarmsStakedDone) {
      setFetchPoolDataDone(true);
    }
  }, [fetchPoolBalancesDone, fetchFarmsStakedDone])

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
      pool['farmStats'] = json[token]?.farm;

      if (pool.id == 'elebnb' && json[token]) {
        pool.farmStats = {
          apy: json[token].apy
        }
      }

      const poolStats = pool.claimable
        ? pool.vault
        : pool.farmStats;

      pool.apy = poolStats?.apy;
      pool.apr = poolStats?.apr;

      return pool;
    });

    normalizedData["totalvaluelocked"] = json["totalvaluelocked"]

    setData(normalizedData);
  }

  useEffect(() => {
    const term = searchTerm.toLowerCase()
    let results = pools.filter(pool =>
      pool.token.toLowerCase().includes(term)
    );

    if (onlyStakedPools) {
      results = results.filter(pool => {
        return tokens[pool.earnedToken]?.tokenBalance > 0
          || pool.stakedAmount?.gt(0);
      });
    }

    if (onlyWithBalancePools) {
      results = results.filter(pool => {
        return tokens[pool.token]?.tokenBalance > 0
          || tokens[pool.earnedToken]?.tokenBalance > 0
          || pool.stakedAmount?.gt(0);
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
        results = _.orderBy(results, pool => pool.apy || 0, 'desc');
        break;
      case "apd":
        results = _.orderBy(results, pool => pool.aprd || 0, 'desc');
        break;
      case "tvl":
        results = _.orderBy(results, pool => pool.tvl || 0, 'desc');
        break;
    }

    setSearchResults(results);
  }, [searchTerm, sortTerm, onlyStakedPools, onlyWithBalancePools, filtersCategories, tokens, pools])

  useEffect(() => {
    const fetch = () => {
      if (address && web3) {
        fetchBalances({ address, web3, tokens });
        fetchPoolBalances({ address, web3, pools });
        fetchFarmsStaked({ address, web3, pools});
      }
    }

    fetch();

    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, [address, web3, fetchBalances, fetchPoolBalances]);

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
        return (
          <Pool key={index}
            pool={pool}
            index={index}
            tokens={tokens}
            fetchBalancesDone={fetchBalancesDone}
            fetchPoolDataDone={fetchPoolDataDone}
          />
        )
      })}
    </Grid>
  )
}
