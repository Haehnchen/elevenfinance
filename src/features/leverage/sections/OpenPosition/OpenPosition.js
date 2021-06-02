import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import { byDecimals } from 'features/helpers/bignumber';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useOpenPosition } from '../../redux/hooks';

import Slider from '@material-ui/core/Slider';

import Alert from 'components/Alert/Alert';
import AmountDialog from 'components/AmountDialog/AmountDialog';
import ApproveTokensDialog from 'components/ApproveTokensDialog/ApproveTokensDialog';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function OpenPosition({ pool, bank, tokens, fetchBalancesDone }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address, network } = useConnectWallet();
  const { openPosition, openPositionPending } = useOpenPosition();

  const [tokensAmounts, setTokensAmounts] = useState([]);
  const [leverage, setLeverage] = useState(pool.maxLeverage);
  const [tokensRequiringApproval, setTokensRequiringApproval] = useState([]);
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);

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

  const onOpenPosition = (amounts) => {
    if (! amounts.filter(amount => +amount > 0).length) {
      enqueueSnackbar(`Enter the amount of collateral to open position`, { variant: 'error' })
      return;
    }

    // Check if any of tokens requires approval
    const approvals = pool.tokens.filter((token, index) => amounts[index] > 0 && ! pool.allowance[token.address || '']);
    if (approvals.length) {
      setTokensRequiringApproval(approvals);
      setAmountDialogOpen(false);
      setApprovalDialogOpen(true);
      return;
    }

    const amountsValues = pool.tokens.map((token, index) => {
      return new BigNumber(amounts[index]);
    });

    openPosition({ address, web3, network, pool, bank, amounts: amountsValues, leverage })
      .then(() => {
        setAmountDialogOpen(false);
        enqueueSnackbar(`Position successfully opened`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Unable to open position: ${error}`, { variant: 'error' }))
  }

  const onTokensApproved = () => {
    setApprovalDialogOpen(false);
    setAmountDialogOpen(true);
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
        buttonIsLoading={openPositionPending[pool.id]}

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

      <ApproveTokensDialog
        address={address}
        web3={web3}
        spender={pool.bigfootAddress}
        tokens={tokensRequiringApproval}
        isOpen={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        onComplete={() => onTokensApproved()}
      />
    </>
  )
}