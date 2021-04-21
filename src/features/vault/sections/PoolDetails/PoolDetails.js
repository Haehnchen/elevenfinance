import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BigNumber from 'bignumber.js';

import Grid from '@material-ui/core/Grid';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchPoolRewards } from 'features/vault/redux/fetchPoolRewards';

import Claimable from './Layouts/Claimable';
import FarmOnly from './Layouts/FarmOnly';
import WithFarm from './Layouts/WithFarm';

import styles from './styles';
const useStyles = makeStyles(styles);

const PoolDetails = ({ pool, index, balanceSingle, sharesBalance }) => {
  const classes = useStyles();

  const { web3, address } = useConnectWallet();
  const { pendingRewards, fetchPoolRewards, fetchPoolRewardsPending } = useFetchPoolRewards();

  const [depositedAmount, setDepositedAmount] = useState(new BigNumber(0));
  const [stakedAmount, setStakedAmount] = useState(new BigNumber(0));

  useEffect(() => {
    const fetch = () => {
      if (address && web3) {
        fetchPoolRewards({ address, web3, pool })
      }
    };

    fetch();

    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, [address, web3, fetchPoolRewards]);

  useEffect(() => {
    if (pool.pricePerFullShare) {
      const pricePerShare = new BigNumber(pool.pricePerFullShare);

      if (sharesBalance) {
        setDepositedAmount(sharesBalance.times(pricePerShare));
      }

      if (pool.stakedAmount) {
        setStakedAmount(pool.stakedAmount.times(pricePerShare));
      }
    }
  }, [pool, sharesBalance]);

  return (
    <Grid item container xs={12} className={classes.poolDetails}>
      {pool.farm && pool.earnContractAddress && (
        <WithFarm pool={pool}
          index={index}
          balanceSingle={balanceSingle}
          depositedAmount={depositedAmount}
          stakedAmount={stakedAmount}
          pendingRewards={pendingRewards[pool.id]} />
      )}

      {pool.farm && ! pool.earnContractAddress && (
        <FarmOnly pool={pool}
          index={index}
          balanceSingle={balanceSingle}
          stakedAmount={stakedAmount}
          pendingRewards={pendingRewards[pool.id]} />
      )}

      {pool.claimable && (
        <Claimable pool={pool}
          index={index}
          balanceSingle={balanceSingle}
          depositedAmount={depositedAmount}
          pendingRewards={pendingRewards[pool.id]} />
      )}
    </Grid>
  );
}

export default PoolDetails;