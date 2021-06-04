import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchPoolsData, useFetchPositions } from '../../redux/hooks';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Positions() {
  const classes = useStyles();
  const { web3, address, network } = useConnectWallet();
  const { banks, pools } = useFetchPoolsData();
  const { positions, fetchPositions } = useFetchPositions();

  useEffect(() => {
    const fetch = (forceUpdate = false) => {
      if (address && web3 && network) {
        fetchPositions({ address, web3, banks, pools, network, forceUpdate });
      }
    }

    fetch(true);

    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [address, web3, network, fetchPositions]);

  return (
    <>
      <h3 className={classes.title}>My Positions</h3>
    </>
  )
}