import React, { useState, useCallback, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Transition } from '@headlessui/react';
import BigNumber from 'bignumber.js';
import { byDecimals } from 'features/helpers/bignumber';

import { useConnectWallet } from 'features/home/redux/hooks';
import { convert3PoolToUsd } from 'features/web3'

import PoolSummary from '../PoolSummary/PoolSummary';
import PoolDetails from '../PoolDetails/PoolDetails';

import styles from './styles';
const useStyles = createUseStyles(styles);

const Pool = ({ pool, index, tokens, fetchBalancesDone, fetchPoolDataDone }) => {
  const classes = useStyles();

  const { web3, address, network } = useConnectWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(new BigNumber(0));
  const [depositedBalance, setDepositedBalance] = useState(new BigNumber(0));
  const [stakedBalance, setStakedBalance] = useState(new BigNumber(0));
  const [depositedAndStaked, setDepositedAndStaked] = useState(null);

  const toggleCard = () => {
    if (pool.network == network) {
      setIsOpen(! isOpen);
    }
  }

  useEffect(() => {
    if (pool.isMultiToken) {
      let balance = new BigNumber(0);

      pool.tokens.map(token => {
        if (tokens[token.token]) {
          balance = balance.plus(byDecimals(tokens[token.token].tokenBalance, token.decimals));
        }
      });

      setTokenBalance(balance);
    } else {
      if (tokens[pool.token]) {
        setTokenBalance(byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals));
      }
    }

    if (fetchPoolDataDone) {
      const depositedBalance = pool.earnContractAddress
        ? byDecimals(tokens[pool.earnedToken].tokenBalance, pool.itokenDecimals).times(pool.pricePerFullShare)
        : new BigNumber(0);

      let stakedBalancePromise;

      if (pool.id == 'bfusd' && depositedBalance.gt(0)) {
        // For Bigfoot USD pool add "virtual" stakedBalance to display values in USD without the need to modify
        // pricePerFullShare
        const amount = depositedBalance.multipliedBy(new BigNumber(10).exponentiatedBy(18)).toFixed(0);
        stakedBalancePromise = convert3PoolToUsd({ web3, address, amount, usdTokenIndex: 0 })
          .then(balanceUsd => byDecimals(balanceUsd, pool.tokens[0].decimals).minus(depositedBalance))
      } else {
        stakedBalancePromise = Promise.resolve((pool.stakedAmount || new BigNumber(0)).times(pool.pricePerFullShare));
      }

      stakedBalancePromise.then(stakedBalance => {
        setDepositedBalance(depositedBalance);
        setStakedBalance(stakedBalance);
        setDepositedAndStaked(depositedBalance.plus(stakedBalance));
      });
    } else {
      setDepositedAndStaked(null);
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
        isActiveNetwork={pool.network == network}
        onClick={() => toggleCard()}
      />

      <Transition
        show={isOpen}
        enter={classes.transitionSlide}
        enterFrom={classes.transitionSlideClosed}
        enterTo={classes.transitionSlideOpen}
        leave={classes.transitionSlide}
        leaveFrom={classes.transitionSlideOpen}
        leaveTo={classes.transitionSlideClosed}
      >
        <PoolDetails pool={pool}
          index={index}
          tokens={tokens}
          tokenBalance={tokenBalance}
          depositedBalance={depositedBalance}
          stakedBalance={stakedBalance}
        />
      </Transition>
    </div>
  );
};

export default Pool;