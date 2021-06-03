import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet } from '../../../home/redux/hooks';
import {
  useFetchBalances,
  useFetchAllowances,
  useFetchPoolsData,
} from '../../redux/hooks';

import Pool from '../Pool/Pool';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function PoolsList() {
  const classes = useStyles();
  const { web3, address, network } = useConnectWallet();
  const { banks, pools, fetchPoolsData, fetchPoolsDataDone } = useFetchPoolsData();
  const { tokens, fetchBalances, fetchBalancesDone } = useFetchBalances();
  const { fetchAllowances } = useFetchAllowances();

  useEffect(() => {
    const fetch = (forceUpdate = false) => {
      if (address && web3 && network) {
        fetchPoolsData({ banks, pools });
        fetchBalances({ address, web3, tokens, network, forceUpdate });
        fetchAllowances({ address, web3, pools, banks, network, forceUpdate });
      }
    }

    fetch(true);

    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [address, web3, network, fetchBalances, fetchAllowances]);

  return (
    <>
      <h3 className={classes.title}>Pools</h3>

      {pools.map(pool => {
        return (
          <Pool
            key={pool.id}
            pool={pool}
            bank={banks[pool.bank]}
            tokens={tokens}
            fetchBalancesDone={fetchBalancesDone}
            fetchPoolsDataDone={fetchPoolsDataDone}
          />
        );
      })}

    </>
  )
}