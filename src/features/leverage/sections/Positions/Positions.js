import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchBanksTokensPrices, useFetchPoolsData, useFetchPositions } from '../../redux/hooks';

import Spinner from 'components/Spinner/Spinner';
import Position from '../Position/Position';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Positions({ mode }) {
  const classes = useStyles();
  const { web3, address, network } = useConnectWallet();
  const { banks, pools } = useFetchPoolsData();
  const { positions, fetchPositions, fetchPositionsDone } = useFetchPositions();
  const { fetchBanksTokensPrices } = useFetchBanksTokensPrices();

  const [displayPositions, setDisplayPositions] = useState([]);

  useEffect(() => {
    const fetch = (forceUpdate = false) => {
      if (address && web3 && network) {
        fetchPositions({ web3, banks, pools, network, forceUpdate });
        fetchBanksTokensPrices({ web3, banks, network });
      }
    }

    fetch(true);

    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, [address, web3, network, fetchPositions]);

  useEffect(() => {
    let items = [...positions];

    if (mode == 'own') {
      const addressLower = address.toLowerCase();
      items = items.filter(position => position.owner.toLowerCase() == addressLower);
    }

    setDisplayPositions(items);
  }, [positions, address])

  return (
    <>
      <h3 className={classes.title}>My Positions</h3>

      {fetchPositionsDone && displayPositions.length > 0 && (
        <div>
          {displayPositions.map(position => {
            return <Position
              key={position.bankId + '_' + position.id}
              position={position}
              bank={banks[position.bankId]}
              pool={pools.find(pool => pool.id == position.poolId)}
            />
          })}
        </div>
      )}

      {fetchPositionsDone && ! displayPositions.length && (
        <div className={classes.emptyMessage}>You don't have open positions</div>
      )}

      {! fetchPositionsDone && (
        <div className={classes.spinner}>
          <Spinner type="dots" />
        </div>
      )}
    </>
  )
}