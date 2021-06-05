import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { byDecimals } from 'features/helpers/bignumber';
import BankHelper from 'features/leverage/banks/BankHelper';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useAdjustPosition, useFetchBalances } from '../../redux/hooks';

import { ChevronDoubleRightIcon } from '@heroicons/react/outline';
import Alert from 'components/Alert/Alert';
import AmountDialog from 'components/AmountDialog/AmountDialog';
import ApproveTokensDialog from 'components/ApproveTokensDialog/ApproveTokensDialog';

import styles from './styles.js';
const useStyles = createUseStyles(styles);

export default function AdjustPosition({ position, pool, bank }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address, network } = useConnectWallet();
  const { tokens } = useFetchBalances();
  const { adjustPosition, adjustPositionPending } = useAdjustPosition();

  const [newLeverage, setNewLeverage] = useState(position.leverage);
  const [newDebtRatio, setNewDebtRatio] = useState(position.debtRatio);
  const [tokensAmounts, setTokensAmounts] = useState([]);
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

  const onAdjustPosition = (amounts) => {
    if (pool.tokens.length == 1) {
      amounts = [amounts];
    }

    if (! amounts.filter(amount => +amount > 0).length) {
      enqueueSnackbar(`Enter the amount of collateral to adjust position`, { variant: 'error' })
      return;
    }

    // Check if any of tokens requires approval
    const approvals = pool.tokens.filter((token, index) => amounts[index] > 0 && ! pool.allowance[token.address || ''])
      .map(token => {
        token.spender = bank.address;
        return token;
      });

    if (approvals.length) {
      setTokensRequiringApproval(approvals);
      setAmountDialogOpen(false);
      setApprovalDialogOpen(true);
      return;
    }

    const amountsValues = pool.tokens.map((token, index) => {
      return new BigNumber(amounts[index]);
    });

    adjustPosition({ address, web3, network, position, pool, bank, amounts: amountsValues })
      .then(() => {
        setAmountDialogOpen(false);
        enqueueSnackbar(`Position successfully adjusted`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Unable to adjust position: ${error}`, { variant: 'error' }))
  }

  // Recalculate position leverage based on collateral being added
  const onAmountsChange = (amounts) => {
    if (pool.tokens.length == 1) {
      amounts = [amounts];
    }

    // Convert all deposited tokens to bank's main token value
    const bankInstance = BankHelper.getBankInstance(bank);

    const bankTokenValues = pool.tokens.map((token, index) => {
      return bankInstance.convertValueToBankToken({ token, amount: new BigNumber(amounts[index]), web3, network });
    });

    Promise.all(bankTokenValues).then(values => {
      // Calculate additional collateral value
      let newCollateral = new BigNumber(0);
      values.map(value => newCollateral = newCollateral.plus(value));

      const leverage = position.size.plus(newCollateral).div(position.collateral.plus(newCollateral));
      const debtRatio = leverage.div(pool.deathLeverage).times(100);

      setNewLeverage(leverage);
      setNewDebtRatio(debtRatio);
    });
  }

  const onTokensApproved = () => {
    setApprovalDialogOpen(false);
    setAmountDialogOpen(true);
  }

  const onAdjustPositionButton = () => {
    setAmountDialogOpen(true);
  }

  const onAmountDialogClose = () => {
    setAmountDialogOpen(false);
  }

  const suffix = (
    <div className={classes.leverageChange}>
      <div className={classes.leverage}>
        <p className={classNames({
          green: position.debtRatio.lt(33),
          orange: position.debtRatio.gte(33) && position.debtRatio.lt(85),
          red: position.debtRatio.gte(85)
        })}>
          { position.leverage.toFixed(2) }
        </p>
        <p>Current Leverage</p>
      </div>

      <div className={classes.arrow}>
        <ChevronDoubleRightIcon />
      </div>

      <div className={classes.leverage}>
        <p className={classNames({
          green: newDebtRatio.lt(33),
          orange: newDebtRatio.gte(33) && newDebtRatio.lt(85),
          red: newDebtRatio.gte(85)
        })}>
          { newLeverage.toFixed(2) }
        </p>
        <p>New Leverage</p>
      </div>
    </div>
  )

  return (
    <>
      <button
        className={classes.button}
        onClick={onAdjustPositionButton}
      >
        Adjust
      </button>

      <AmountDialog
        multiToken={true}
        tokensAmounts={tokensAmounts}
        onConfirm={onAdjustPosition}
        onAmountsChange={onAmountsChange}

        title={'Adjust Leveraged Position'}
        buttonText={'Adjust Position'}
        buttonIsLoading={adjustPositionPending[bank.id]?.[position.id]}
        inputLabelText={'Collateral Amount'}
        disableSlider={true}

        open={amountDialogOpen}
        onClose={onAmountDialogClose}

        suffix={suffix}
      >
        <Alert>
          Provide additional assets in order to increase your collateral and reduce liquidation risks
        </Alert>
      </AmountDialog>

      <ApproveTokensDialog
        address={address}
        web3={web3}
        tokens={tokensRequiringApproval}
        isOpen={approvalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        onComplete={() => onTokensApproved()}
      />
    </>
  )
}