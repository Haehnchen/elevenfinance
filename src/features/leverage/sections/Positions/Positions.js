import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchBanksTokensPrices, useFetchPoolsData, useFetchPositions } from '../../redux/hooks';

import Spinner from 'components/Spinner/Spinner';
import Position from '../Position/Position';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Positions({ }) {
  const classes = useStyles();
  const { web3, address, network } = useConnectWallet();
  const { banks, pools } = useFetchPoolsData();
  const { positions, fetchPositions, fetchPositionsDone } = useFetchPositions();
  const { fetchBanksTokensPrices } = useFetchBanksTokensPrices();

  const [mode, setMode] = useState('own');
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
  }, [positions, address, mode])

  const toggleMode = () => {
    setMode(mode == 'own' ? 'all' : 'own');
  }

  return (
    <>
      <div className={classes.titleSection}>
        <h3 className={classes.title}>
          { mode == 'own' ? 'My Positions' : 'All positions' }
        </h3>
        <div>
          <a
            className={classes.link}
            onClick={toggleMode}
          >
            { mode == 'own' ? 'Show all users positions' : 'Show my positions' }
          </a>
        </div>
      </div>

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