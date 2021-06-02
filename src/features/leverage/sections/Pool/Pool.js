import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet } from 'features/home/redux/hooks';
import { switchNetwork } from 'features/web3/switchNetwork.js';
import { networks } from 'features/configure';

import Loader from 'components/Loader/Loader';
import Tooltip from 'components/Tooltip/Tooltip';

import OpenPosition from '../OpenPosition/OpenPosition';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function Pool({ bank, pool, tokens, fetchBalancesDone, fetchPoolsDataDone }) {
  const classes = useStyles();

  const { web3, network, connectWallet } = useConnectWallet();

  const [leverage, setLeverage] = useState(pool.maxLeverage);
  const [apr, setApr] = useState(0);
  const [yieldFarming, setYieldFarming] = useState(0);
  const [tradingFee, setTradingFee] = useState(0);
  const [borrowApy, setBorrowApy] = useState(0);

  const poolNetwork = networks.find(network => pool.network == network.name);
  const isActiveNetwork = pool.network == network;

  useEffect(() => {
    const multiplier = (leverage - 1) * 2;

    const yieldFarming = (pool.aprd ?? 0) * 365 * leverage;
    const tradingFee = (pool.rates?.tradingFee ?? 0) * multiplier;
    const borrowApy = (bank?.baseBorrowApy ?? 0) * multiplier / 2;

    const apr = Math.round((yieldFarming + tradingFee - borrowApy) * 100) / 100;

    setApr(apr);
    setYieldFarming(yieldFarming);
    setTradingFee(tradingFee);
    setBorrowApy(borrowApy);
  }, [bank, pool, leverage]);

  const updateLeverage = (value) => {
    if (value >= 1 && value <= pool.maxLeverage) {
      setLeverage(value);
    } else {
      setLeverage(pool.maxLeverage);
    }
  }

  const onLeverageInputChange = (ev) => {
    updateLeverage(ev.target.value);
  }

  const onLeverageIncrease = () => {
    updateLeverage(leverage + 0.5);
  }

  const onLeverageDecrease = () => {
    updateLeverage(leverage - 0.5);
  }

  const onNetworkSwitch = () => {
    switchNetwork({
      web3,
      params: poolNetwork.params,
      connectWallet
    })
  }

  return (
    <div className={classes.pool}>
      <div className={classes.summary}>
        <div className={classes.poolInfo}>
          <div className={classes.logo + ' wide'}>
            <img src={require(`images/${pool.image}`)} />
          </div>

          <div className={classes.nameBlock}>
            <p className={classes.name}>{pool.name}</p>
            <p className={classes.description}>{`Uses ${pool.bank} bank`}</p>
          </div>
        </div>

        <div className={classes.counter}>
          <div>
            {fetchPoolsDataDone
              ? (
                <>
                  { `${apr}%` }
                  <Tooltip position="bottom-right">
                    <div className={classes.stats}>
                      <div>
                        <p>Yield Farming</p>
                        {tradingFee > 0 && (<p>Trading Fees</p>)}
                        <p>Borrow APY</p>
                      </div>

                      <div>
                        <p>{ yieldFarming.toFixed(2) }%</p>
                        {tradingFee > 0 && (<p>{ tradingFee.toFixed(2) }%</p>)}
                        <p>-{ borrowApy.toFixed(2) }%</p>
                      </div>
                    </div>
                  </Tooltip>
                </>
              )
              : <Loader />
            }
          </div>
          <p>APR</p>
        </div>

        {/* Leverage Select */}
        <div className={classes.counter + ' ' + classes.leverage}>
          <p>
            <button
              className={classes.leverageButton}
              onClick={onLeverageDecrease}
            >
              -
            </button>

            <input
              className={classes.leverageInput}
              onChange={onLeverageInputChange}
              value={leverage}
            />

            <button
              className={classes.leverageButton}
              onClick={onLeverageIncrease}
            >
              +
            </button>
          </p>
          <p>Leverage</p>
        </div>

        {/* Actions */}
        {isActiveNetwork && (
          <div className={classes.controls}>
            <OpenPosition
              pool={pool}
              bank={bank}
              tokens={tokens}
              fetchBalancesDone={fetchBalancesDone}
            />
          </div>
        )}

        {/* Network Switch */}
        {! isActiveNetwork && (
          <div
            className={classes.networkSwitch}
            onClick={() => onNetworkSwitch()}
          >
            Available on

            {poolNetwork && (
              <div className={classes.networkName}>
                <img src={require(`assets/img/networks/${poolNetwork.image}`)} />
                { poolNetwork.label }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}