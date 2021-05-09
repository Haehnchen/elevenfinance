import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import BigNumber from 'bignumber.js';
import { useSnackbar } from 'notistack';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchDeposit, useFetchApproval } from 'features/vault/redux/hooks';

import Spinner from 'components/Spinner/Spinner';
import AmountDialog from 'components/AmountDialog/AmountDialog'

import styles from './styles';
const useStyles = createUseStyles(styles);

const DepositButton = ({ pool, index, balance }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositEth, fetchDepositPending } = useFetchDeposit();

  const [amountDialogOpen, setAmountDialogOpen] = useState(false);

  const handleApproval = () => {
    fetchApproval({
      address,
      web3,
      tokenAddress: pool.tokenAddress,
      contractAddress: pool.earnContractAddress,
      index
    })
      .then(() => enqueueSnackbar(`Approval success`, { variant: 'success' }))
      .catch(error => enqueueSnackbar(`Approval error: ${error}`, { variant: 'error' }))
  }

  const handleDeposit = (amount) => {
    if (! amount || amount == '0') {
      enqueueSnackbar(`Enter the amount to deposit`, { variant: 'error' })
      return;
    }

    let amountValue = amount.replace(',', '')

    if (pool.tokenAddress) {
      fetchDeposit({
        address,
        web3,
        isAll: false,
        amount: new BigNumber(amountValue)
          .multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals))
          .toString(10),
        contractAddress: pool.earnContractAddress,
        index
      })
        .then(() => {
          setAmountDialogOpen(false);
          enqueueSnackbar(`Deposit success`, { variant: 'success' })
        })
        .catch(error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' }))
    } else {
      fetchDepositEth({
        address,
        web3,
        amount: new BigNumber(amountValue)
          .multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals))
          .toString(10),
        contractAddress: pool.earnContractAddress,
        index
      })
        .then(() => {
          setAmountDialogOpen(false);
          enqueueSnackbar(`Deposit success`, { variant: 'success' })
        })
        .catch(error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' }))
    }
  }

  const handleDepositButton = () => {
    setAmountDialogOpen(true);
  }

  const handleAmountDialogClose = () => {
    setAmountDialogOpen(false);
  }

  return (
    <span>
      {pool.allowance === 0 ? (
        <button className={classes.buttonPrimary}
          onClick={handleApproval}
          disabled={fetchApprovalPending[index]}
        >
          {!fetchApprovalPending[index]
            ? `${t('Vault-ApproveButton')}`
            : (<Spinner />)}
        </button>
      ) : (
        <button className={classes.buttonPrimary}
          onClick={handleDepositButton}
        >
          {t('Vault-DepositButton')}
        </button>
      )}

      <AmountDialog
        balance={balance}
        decimals={pool.tokenDecimals}
        onConfirm={handleDeposit}

        title={'Deposit to Vault'}
        buttonText={'Deposit'}
        buttonIsLoading={fetchDepositPending[index]}

        open={amountDialogOpen}
        onClose={handleAmountDialogClose} />
    </span>
  );
};

export default DepositButton;