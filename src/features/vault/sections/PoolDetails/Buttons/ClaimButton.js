import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchClaim } from 'features/vault/redux/hooks';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from './styles';
const useStyles = makeStyles(styles);

const ClaimButton = ({ pool }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchClaim, fetchClaimPending } = useFetchClaim();

  const handleHarvest = () => {
    fetchClaim({ address, web3, pool })
      .then(() => enqueueSnackbar(`Harvest success`, { variant: 'success' }))
      .catch(error => enqueueSnackbar(`Harvest error: ${error}`, { variant: 'error' }))
  }

  return (
    <Button className={classes.buttonPrimary}
      onClick={handleHarvest}
    >
      {!fetchClaimPending[pool.id] ? t('Vault-HarvestButton') : (
        <CircularProgress
          className={classes.buttonLoader}
          size={20}
          thickness={6} />
      )}
    </Button>
  );
};

export default ClaimButton;