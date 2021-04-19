import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchFarmUnstake } from 'features/vault/redux/hooks';

import Button from '@material-ui/core/Button';

import AmountDialog from 'components/AmountDialog/AmountDialog';

import styles from './styles';
const useStyles = makeStyles(styles);

const UnstakeButton = ({ pool, index, balance }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchFarmUnstake, fetchFarmUnstakePending } = useFetchFarmUnstake();

  const [amountDialogOpen, setAmountDialogOpen] = useState(false);

  const handleUnstake = (amount) => {
    if (! amount || amount == '0') {
      enqueueSnackbar(`Enter the amount to unstake`, { variant: 'error' })
      return;
    }

    let amountValue = amount.replace(',', '')

    fetchFarmUnstake({
      address,
      web3,
      pool,
      amount: new BigNumber(amountValue)
        .multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals))
        .dividedBy(pool.pricePerFullShare)
        .toFixed(0)
    })
      .then(() => {
        setAmountDialogOpen(false);
        enqueueSnackbar(`Withdraw success`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' }))
  }

  const handleUnstakeButton = () => {
    setAmountDialogOpen(true);
  }

  const handleAmountDialogClose = () => {
    setAmountDialogOpen(false);
  }

  return (
    <span>
      <Button className={classes.buttonPrimary + ' ' + classes.buttonOutline}
        onClick={handleUnstakeButton}
      >
        {t('Vault-Unstake')}
      </Button>

      <AmountDialog
        balance={balance}
        decimals={pool.itokenDecimals}
        onConfirm={handleUnstake}

        title={'Unstake from Farm'}
        buttonText={'Unstake'}
        buttonIsLoading={fetchFarmUnstakePending[pool.id]}

        open={amountDialogOpen}
        onClose={handleAmountDialogClose} />
    </span>
  )
};

export default UnstakeButton;