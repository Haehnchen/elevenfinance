import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import BigNumber from 'bignumber.js';
import { byDecimals } from 'features/helpers/bignumber';

import Slider from '@material-ui/core/Slider';

import Alert from 'components/Alert/Alert';
import AmountDialog from 'components/AmountDialog/AmountDialog';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function OpenPosition({ pool, tokens, fetchBalancesDone }) {
  const classes = useStyles();

  const [tokensAmounts, setTokensAmounts] = useState([]);
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [leverage, setLeverage] = useState(pool.maxLeverage)

  useEffect(() => {
    const amounts = [];

    pool.tokens.forEach(token => {
      let balance = byDecimals(tokens[token.token].tokenBalance, token.decimals);

      // If pool uses network's native token (ETH, BNB, etc) - leave some reserve for TX fees
      if (token.address === null) {
        balance = balance.minus(0.02);
      }

      if (balance.lt(0)) {
        balance = new BigNumber(0);
      }

      amounts.push({
        token: token.token,
        decimals: token.decimals,
        image: token.image,
        balance: balance
      })
    });

    setTokensAmounts(amounts)
  }, [pool, tokens]);

  const onOpenPosition = () => {
    // TODO:
  }

  const onOpenPositionButton = () => {
    setAmountDialogOpen(true);
  }

  const onAmountDialogClose = () => {
    setAmountDialogOpen(false);
  }

  const leverageSteps = [];
  for (let i = 1.5; i <= pool.maxLeverage; i += 0.5) {
    leverageSteps.push({
      value: i,
      label: i
    });
  }

  const suffix = (
    <div>
      <div className={classes.sliderWrapper}>
        <label className={classes.label}>Leverage</label>
        <Slider
          classes={{
            root: classes.sliderRoot,
            rail: classes.sliderRail,
            mark: classes.sliderMark,
            markLabel: classes.sliderMarkLabel,
          }}
          aria-labelledby="continuous-slider"
          value={leverage}
          valueLabelDisplay="off"
          min={1.5}
          max={pool.maxLeverage}
          step={0.5}
          marks={leverageSteps}
          onChange={(ev, value) => setLeverage(value)}
        />
      </div>
    </div>
  );

  return (
    <>
      <button
        className={classes.button}
        onClick={onOpenPositionButton}
      >
        Open Position
      </button>

      <AmountDialog
        multiToken={true}
        tokensAmounts={tokensAmounts}
        onConfirm={onOpenPosition}

        title={'Open Leveraged Position'}
        buttonText={'Open Position'}
        buttonIsLoading={false}

        open={amountDialogOpen}
        onClose={onAmountDialogClose}

        suffix={suffix}
      >
        <Alert type="warning">
          <p>
            <b>Note:</b> BigFoot is a leveraged yield farming/liquidity providing product. There are risks involved
            when using this product.
          </p>
          <p>
            Please read <a href="https://11eleven-11finance.gitbook.io/bigfoot/using-bigfoot/liquidation" target="_blank">here</a> to
            understand the risks involved.
          </p>
        </Alert>
      </AmountDialog>
    </>
  )
}