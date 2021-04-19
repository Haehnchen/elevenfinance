import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchFarmAllowance, useFetchFarmApproval, useFetchFarmStake } from 'features/vault/redux/hooks';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import AmountDialog from 'components/AmountDialog/AmountDialog'

import styles from './styles';
const useStyles = makeStyles(styles);

const StakeButton = ({ pool, index, balance }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { farmAllowance, fetchFarmAllowance } = useFetchFarmAllowance();
  const { fetchFarmApproval, fetchFarmApprovalPending } = useFetchFarmApproval();
  const { fetchFarmStake, fetchFarmStakePending } = useFetchFarmStake();

  const [amountDialogOpen, setAmountDialogOpen] = useState(false);

  useEffect(() => {
    const fetch = () => {
      if (address && web3) {
        fetchFarmAllowance({ address, web3, pool })
      }
    };

    fetch();

    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, [address, web3]);

  const handleApproval = () => {
    fetchFarmApproval({
      address,
      web3,
      pool,
      index
    })
      .then(() => enqueueSnackbar(`Approval success`, { variant: 'success' }))
      .catch(error => enqueueSnackbar(`Approval error: ${error}`, { variant: 'error' }))
  }

  const handleStake = (amount) => {
    if (! amount || amount == '0') {
      enqueueSnackbar(`Enter the amount to stake`, { variant: 'error' })
      return;
    }

    let amountValue = amount.replace(',', '')

    fetchFarmStake({
      address,
      web3,
      pool,
      amount: new BigNumber(amountValue)
        .multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals))
        .dividedBy(pool.pricePerFullShare)
        .toFixed(0),
    })
      .then(() => {
        setAmountDialogOpen(false);
        enqueueSnackbar(`Stake success`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Stake error: ${error}`, { variant: 'error' }))
  }

  const handleStakeButton = () => {
    setAmountDialogOpen(true);
  }

  const handleAmountDialogClose = () => {
    setAmountDialogOpen(false);
  }

  return (
    <span>
      {farmAllowance[pool.id] ? (
        <Button className={classes.buttonPrimary}
          onClick={handleStakeButton}
        >
          {t('Vault-Stake')}
        </Button>
      ) : (
        <Button className={classes.buttonPrimary}
          onClick={handleApproval}
          disabled={fetchFarmApprovalPending[pool.id]}
        >
          {!fetchFarmApprovalPending[pool.id] ? `${t('Vault-ApproveButton')}` : (
            <CircularProgress
              className={classes.buttonLoader}
              size={20}
              thickness={6} />
          )}
        </Button>
      )}

      <AmountDialog
        balance={balance}
        decimals={pool.itokenDecimals}
        onConfirm={handleStake}

        title={'Stake in Farm'}
        buttonText={'Stake'}
        buttonIsLoading={fetchFarmStakePending[pool.id]}

        open={amountDialogOpen}
        onClose={handleAmountDialogClose} />
    </span>
  );
};

export default StakeButton;