import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BigNumber from 'bignumber.js';

import Grid from '@material-ui/core/Grid';

import Claimable from './Layouts/Claimable';
import FarmOnly from './Layouts/FarmOnly';
import WithFarm from './Layouts/WithFarm';

import styles from './styles';
const useStyles = makeStyles(styles);

const PoolDetails = ({ pool, index, balanceSingle, sharesBalance, pendingRewards }) => {
  const classes = useStyles();

  const [depositedAmount, setDepositedAmount] = useState(new BigNumber(0));
  const [stakedAmount, setStakedAmount] = useState(new BigNumber(0));

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
          pendingRewards={pendingRewards} />
      )}

      {pool.farm && ! pool.earnContractAddress && (
        <FarmOnly pool={pool}
          index={index}
          balanceSingle={balanceSingle}
          stakedAmount={stakedAmount}
          pendingRewards={pendingRewards} />
      )}

      {pool.claimable && (
        <Claimable pool={pool}
          index={index}
          balanceSingle={balanceSingle}
          depositedAmount={depositedAmount}
          pendingRewards={pendingRewards} />
      )}
    </Grid>
  );
}

export default PoolDetails;