import React from 'react';
import { createUseStyles } from 'react-jss';

import Select from 'components/Select/Select';
import { FilterIcon, SortDescendingIcon } from '@heroicons/react/outline'

import { useFetchFilters, useFetchPoolsInfo } from '../../redux/hooks';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

const Filters = () => {
  const classes = useStyles();
  const { categories } = useFetchPoolsInfo();
  const { filters, setCategoriesFilter, setDepositedFilter, setWithBalanceFilter, setSort } = useFetchFilters();

  const sortOptions = [
    {value: 'default', name: 'Default'},
    {value: 'apy', name: 'APY'},
    {value: 'tvl', name: 'TVL'},
  ]

  const onSortSelect = item => {
    setSort(item || 'default');
  }

  return (
    <>
      <div className={classes.filters}>
        <div>
          <Select
            options={categories.map(item => ({value: item.name, name: item.name}))}
            multiple={true}
            placeholder="All Groups"
            icon={<FilterIcon />}
            onChange={setCategoriesFilter}
          />

          <div className={classes.checkboxes}>
            <label className={classes.checkbox + (filters.withBalance ? ' active' : '')}>
              <input type="checkbox"
                checked={filters.withBalance}
                onChange={e => setWithBalanceFilter(e.target.checked)}
                name="with_balance"
              />

              Hide Zero Balances
            </label>

            <label className={classes.checkbox + (filters.deposited ? ' active' : '')}>
              <input type="checkbox"
                checked={filters.deposited}
                onChange={e => setDepositedFilter(e.target.checked)}
                name="deposited"
              />

              Deposited Only
            </label>
          </div>
        </div>

        <div>
          <Select
            options={sortOptions}
            placeholder="Sort"
            icon={<SortDescendingIcon />}
            onChange={onSortSelect}
          />
        </div>
      </div>
    </>
  );
};

export default Filters;