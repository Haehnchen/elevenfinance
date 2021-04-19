import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { formatDecimals } from 'features/helpers/bignumber';
import { useSnackbar } from 'notistack';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchClaim } from 'features/vault/redux/hooks';

import styles from './styles';
const useStyles = makeStyles(styles);

const HarvestSection = ({ pool, index, pendingRewards }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchClaim, fetchClaimPending } = useFetchClaim();

  const onClaim = () => {
    fetchClaim({ address, web3, pool })
      .then(() => enqueueSnackbar(`Harvest success`, { variant: 'success' }))
      .catch(error => enqueueSnackbar(`Harvest error: ${error}`, { variant: 'error' }))
  }

  return (
    <Grid item sm={12} md={2} className={classes.vaultPendingRewards}>
      <Grid item xs={12} className={classes.vaultPendingTitle}>
        {t('Vault-PendingRewards')}
      </Grid>

      <Grid item xs={6} sm={4} md={12}>
        <div className={classes.counter}>{formatDecimals(pendingRewards?.pendingEle)}</div>
        <div className={classes.counterDescription}>{t('Vault-Pending')} ELE</div>
      </Grid>

      <Grid item xs={6} sm={4} md={12}>
        <div className={classes.counter}>{formatDecimals(pendingRewards?.pendingToken)}</div>
        <div className={classes.counterDescription}>{t('Vault-Pending')} {pool.claimableToken}</div>
      </Grid>

      <Grid item xs={12} sm={4} md={12}>
        <Button className={classes.buttonPrimary}
          onClick={onClaim}
          disabled={fetchClaimPending[pool.id]}
        >
          {fetchClaimPending[pool.id]
            ? t('Vault-HarvestING')
            : t('Vault-HarvestButton')}
        </Button>
      </Grid>
    </Grid>
  );
}

export default HarvestSection;