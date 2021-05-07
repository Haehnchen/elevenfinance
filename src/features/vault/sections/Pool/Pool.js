import React, { useState, useCallback, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import BigNumber from 'bignumber.js';
import { byDecimals } from 'features/helpers/bignumber';

import PoolSummary from '../PoolSummary/PoolSummary';
import PoolDetails from '../PoolDetails/PoolDetails';

import styles from './styles';
const useStyles = createUseStyles(styles);

const Pool = ({ pool, index, tokens, fetchBalancesDone, fetchPoolDataDone }) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(new BigNumber(0));
  const [depositedBalance, setDepositedBalance] = useState(new BigNumber(0));
  const [stakedBalance, setStakedBalance] = useState(new BigNumber(0));
  const [depositedAndStaked, setDepositedAndStaked] = useState(null);

  const toggleCard = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  useEffect(() => {
    if (tokens[pool.token]) {
      setTokenBalance(byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals));
    }

    if (fetchPoolDataDone) {
      const depositedBalance = pool.earnContractAddress
        ? byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals).times(pool.pricePerFullShare)
        : new BigNumber(0);

      const stakedBalance = (pool.stakedAmount || new BigNumber(0)).times(pool.pricePerFullShare);

      setDepositedBalance(depositedBalance);
      setStakedBalance(stakedBalance);
      setDepositedAndStaked(depositedBalance.plus(stakedBalance));
    }
  }, [tokens, pool, fetchPoolDataDone])

  return (
    <div key={pool.id}
      className={classes.pool}
    >
      <PoolSummary pool={pool}
        tokenBalance={tokenBalance}
        depositedBalance={depositedAndStaked}
        fetchBalanceDone={fetchBalancesDone}
        onClick={toggleCard}
      />

      {/* <PoolDetails pool={pool}
        index={index}
        tokenBalance={tokenBalance}
        depositedBalance={depositedBalance}
        stakedBalance={stakedBalance}
      /> */}
    </div>
  );
};

export default Pool;