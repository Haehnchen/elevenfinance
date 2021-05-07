import React, { useState } from 'react';
import classNames from 'classnames';
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

import { useFetchPoolsInfo } from '../../redux/hooks';

import styles from './styles.js';
const useStyles = makeStyles(styles);

const Filters = () => {
  const classes = useStyles();
  const { categories } = useFetchPoolsInfo();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortTerm, setSortTerm] = useState('default');
  const [onlyStakedPools, setOnlyStakedPools] = useState(false);
  const [onlyWithBalancePools, setOnlyWithBalancePools] = useState(false);
  const [filtersCategories, setFiltersCategories] = useState([]);

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
    <>
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
    </>
  );
};

export default Filters;