import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet } from '../../../home/redux/hooks';
import {
  useFetchLeverageBalances,
} from '../../redux/hooks';

import Pool from '../Pool/Pool';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function LeverageList() {
  const classes = useStyles();
  const { web3, address, network } = useConnectWallet();
  let { leverageOptions, fetchLeverageBalances, fetchLeverageBalancesDone } = useFetchLeverageBalances();

  //
  const fetchBalances = null; //@todo: implement useFetchBalances
  // const { tokens, fetchBalances, fetchBalancesDone } = useFetchBalances();
  //

  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const fetch = (forceUpdate = false) => {
  //     if (address && web3 && network) {
  //       fetchLeverageBalances({ address, web3, leverageOptions, network, forceUpdate });
  //     }
  //   }

  //   fetch(true);

  //   const id = setInterval(fetch, 15000);
  //   return () => clearInterval(id);
  // }, [address, web3, network, fetchBalances, fetchLeverageBalances]);

  return (
    <>
      <h3 className={classes.title}>Pools</h3>

      {leverageOptions.map(pool => {
        return (
          <Pool
            key={pool.id}
            pool={pool}
          />
        );
      })}

    </>
  )
}