import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { useConnectWallet, useFetchTokenPrice } from '../redux/hooks';

import Loader from 'components/Loader/Loader';
import { LightningBoltIcon, DocumentTextIcon, ExternalLinkIcon, FingerPrintIcon } from '@heroicons/react/outline'

import logo from 'assets/img/logo.png';
import bscLogo from 'assets/img/networks/binance.png';
import twitterLogo from 'assets/img/socials/twitter.png';
import telegramLogo from 'assets/img/socials/telegram.png';
import mediumLogo from 'assets/img/socials/medium.png';
import githubLogo from 'assets/img/socials/github.png';
import { ReactComponent as BigfootIcon } from 'assets/img/bigfoot.svg';

import styles from './styles';
const useStyles = createUseStyles(styles);

const Sidebar = ({ connected, address, connectWallet, disconnectWallet }) => {
  const classes = useStyles();
  const { web3 } = useConnectWallet();
  const { tokenPriceUsd, fetchTokenPrice, fetchTokenPriceDone } = useFetchTokenPrice();

  const [shortAddress, setShortAddress] = useState('');

  useEffect(() => {
    const fetch = () => {
      if (web3) {
        fetchTokenPrice({ web3 });
      }
    }

    fetch();

    const id = setInterval(fetch, 60000);
    return () => clearInterval(id);
  }, [web3])

  useEffect(() => {
    if (! connected) {
      return;
    }

    if (address.length < 11) {
      setShortAddress(address)
    } else {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`)
    }
  }, [address])

  return (
    <div className={classes.sidebar}>
      {/* Logo */}
      <a href="#" className={classes.logo}>
        <img src={logo} />
        ELEVEN.FINANCE
      </a>

      <div>
        {/* Network */}
        <div className={classes.network}>
          <img src={bscLogo} />
          <span>Binance Smart Chain</span>

          <div className={classes.networkStatus + ' connected'}></div>
        </div>

        {/* Wallet */}
        <button className={classes.wallet}
          onClick={connected ? disconnectWallet : connectWallet}
        >
          <FingerPrintIcon />
          { connected && shortAddress ? shortAddress : 'WALLET' }
        </button>
      </div>

      <div className={classes.divider}></div>

      <ul className={classes.menu}>
        <li className={classes.menuItem + ' active'}>
          <a href="/#/vault">
            <LightningBoltIcon />
            Vault
          </a>
        </li>

        <li className={classes.menuItem}>
          <a href="https://11eleven-11finance.gitbook.io/eleven-finance/" target="_blank">
            <DocumentTextIcon />
            Documentation
          </a>
        </li>
      </ul>

      <a className={classes.bigfootButton}
        href="http://bigfoot.eleven.finance"
        target="_blank"
      >
        <BigfootIcon />
        Bigfoot
      </a>


      <div className={classes.bottom}>
        {/* Price & Buy */}
        <div className={classes.priceBlock}>
          <div className={classes.price}>
            <img src={logo} />
            { fetchTokenPriceDone
              ? '$' + (tokenPriceUsd ? tokenPriceUsd.toFixed(2) : '--')
              : <Loader />
            }
          </div>
          <div>
            <a className={classes.buyButton}
              href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xacd7b3d9c10e97d0efa418903c0c7669e702e4c0"
              target="_blank"
            >
              <ExternalLinkIcon />
              Buy ELE
            </a>
          </div>
        </div>

        <div className={classes.divider + ' small'}></div>

        {/* Social Links */}
        <div className={classes.socials}>
          <a href="https://twitter.com/elevenfinance" target="_blank">
            <img src={twitterLogo} />
          </a>
          <a href="https://t.me/elevenfinance" target="_blank">
            <img src={telegramLogo} />
          </a>
          <a href="https://elevenfinance.medium.com/" target="_blank">
            <img src={mediumLogo} />
          </a>
          <a href="https://github.com/Eleven-Finance" target="_blank">
            <img src={githubLogo} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;