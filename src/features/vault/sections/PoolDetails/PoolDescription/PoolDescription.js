import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';

import Tooltip from 'components/Tooltip/Tooltip';
import { ExternalLinkIcon } from '@heroicons/react/outline';

import styles from './styles';
const useStyles = createUseStyles(styles);

export default function PoolDescription({ pool }) {
  const classes = useStyles();

  const [performanceFee, setPerformanceFee] = useState(0);

  useEffect(() => {
    let fee = 0;

    if (pool.fees) {
      fee = (pool.fees.controller || 0)
        + (pool.fees.platform || 0)
        + (pool.fees.dividends || 0)
        + (pool.fees.buybacks || 0);
    }

    setPerformanceFee(fee);
  }, [pool]);

  return (
    <div className={classes.descriptionSection + ' ' + classes.statsSection}>
      {(pool.fees || pool.links) && (
        <div className={classes.statsContent}>
          {pool.fees && (
            <>
              {pool.fees.third_party && (
                <div className="item warning">
                  <span>3rd party fee</span>
                  <span>{ pool.fees.third_party }</span>
                </div>
              )}
              <div className="item">
                <span>Deposit fee</span>
                <span>{ pool.fees.deposit ? pool.fees.deposit + '% on capital' : 'none' }</span>
              </div>
              <div className="item">
                <span>Withdrawal fee</span>
                <span>{ pool.fees.withdrawal ? pool.fees.withdrawal + '% on capital' : 'none' }</span>
              </div>
              <div className="item">
                <span>Performance fee</span>
                <span>
                  { performanceFee
                    ? (
                      <>
                        {performanceFee + '% on profits'}
                        <Tooltip position="bottom-left">
                          {pool.fees.buybacks > 0 && (
                            <div>{pool.fees.buybacks + '%'} - ELE Buybacks</div>
                          )}
                          {pool.fees.dividends > 0 && (
                            <div>{pool.fees.dividends + '%'} - ELE pool dividends</div>
                          )}
                          {pool.fees.controller > 0 && (
                            <div>{pool.fees.controller + '%'} - Controller</div>
                          )}
                          {pool.fees.platform > 0 && (
                            <div>{pool.fees.platform + '%'} - Platform</div>
                          )}
                        </Tooltip>
                        <br/>
                        <i className="small">(75% of fees buyback ELE)</i>
                      </>
                    )
                    : 'none'
                  }
                </span>
              </div>

              {pool.fees.waultx_burn && (
                <div className="item">
                  <span>WAULTx burn</span>
                  <span>{ pool.fees.waultx_burn + '% on profits' }</span>
                </div>
              )}
            </>
          )}

          {pool.links && (
            <div className={classes.statsLinks}>
              {pool.links.map((link, index) => {
                return (
                  <a
                    href={link.url}
                    key={index}
                    target="_blank"
                  >
                    <ExternalLinkIcon />
                    {
                      link.text || (
                        link.type == 'buy_token'
                          ? 'Buy Token'
                          : 'Add Liquidity'
                      )
                    }
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}