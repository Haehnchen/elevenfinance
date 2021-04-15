import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { makeStyles } from '@material-ui/core/styles';
import { byDecimals, calculateReallyNum, forMat, formatDecimals } from 'features/helpers/bignumber';
import { inputLimitPass, inputFinalVal, isEmpty } from 'features/helpers/utils';
import { useSnackbar } from 'notistack';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import CustomSlider from 'components/CustomSlider/CustomSlider';

import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchDeposit, useFetchApproval } from 'features/vault/redux/hooks';

import styles from './styles';
const useStyles = makeStyles(styles);

const DepositSection = ({ pool, index, balanceSingle }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositEth, fetchDepositPending } = useFetchDeposit();

  const [depositBalance, setDepositBalance] = useState({
    amount: 0,
    slider: 0,
  });

  const onApproval = () => {
    fetchApproval({
      address,
      web3,
      tokenAddress: pool.tokenAddress,
      contractAddress: pool.earnContractAddress,
      index
    }).then(
      () => enqueueSnackbar(`Approval success`, { variant: 'success' })
    ).catch(
      error => enqueueSnackbar(`Approval error: ${error}`, { variant: 'error' })
    )
  }

  const onDeposit = isAll => {
    if (isAll) {
      setDepositBalance({
        amount: forMat(balanceSingle),
        slider: 100,
      });
    }

    let amountValue = depositBalance.amount
      ? depositBalance.amount.replace(',', '')
      : depositBalance.amount;

    if (pool.tokenAddress) {
      fetchDeposit({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue)
          .multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals))
          .toString(10),
        contractAddress: pool.earnContractAddress,
        index
      })
        .then(() => enqueueSnackbar(`Deposit success`, { variant: 'success' }))
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
        .then(() => enqueueSnackbar(`Deposit success`, { variant: 'success' }))
        .catch(error => enqueueSnackbar(`Deposit error: ${error}`, { variant: 'error' }))
    }
  }

  const isMoreDepostLimit = (value, depostLimit) => {
    if (isEmpty(value) || depostLimit == 0 || value < depostLimit) {
      return false
    }
    return true;
  }

  const onInputChange = event => {
    let value = event.target.value;
    const total = balanceSingle.toNumber();

    if (!inputLimitPass(value, pool.tokenDecimals)) {
      return;
    }

    let sliderNum = 0;
    let inputVal = 0;
    if (value) {
      inputVal = Number(value.replace(',', ''));
      sliderNum = byDecimals(inputVal / total, 0).toFormat(2) * 100;
    }

    setDepositBalance({
      amount: inputFinalVal(value, total, pool.tokenDecimals),
      slider: sliderNum,
    });
  };

  const onSliderChange = (_, sliderNum) => {
    const total = balanceSingle.toNumber();

    setDepositBalance({
      amount: sliderNum === 0 ? 0 : calculateReallyNum(total, sliderNum),
      slider: sliderNum,
    });
  };

  return (
    <Grid item xs={12} sm={6} md={pool.claimable ? 5 : 6} className={classes.sliderDetailContainer}>
      {/* Balance */}
      <div className={classes.poolBalanceBlock}>
        <div>{t('Vault-Balance')}</div>
        <div>
          <div>
            {formatDecimals(balanceSingle)}
            {pool.price && (
              <span>
                  &nbsp; (${balanceSingle.times(pool.price).toFixed(2)})
              </span>
            )}
          </div>
          <div className={classes.poolBalanceDescription}>&nbsp;</div>
        </div>
      </div>

      {/* Input */}
      <FormControl fullWidth variant="outlined">
        <CustomOutlinedInput
          value={depositBalance.amount}
          onChange={onInputChange}
        />
      </FormControl>

      {/* Slider */}
      <CustomSlider
        classes={{
          root: classes.depositedBalanceSliderRoot,
          markLabel: classes.depositedBalanceSliderMarkLabel,
        }}
        aria-labelledby="continuous-slider"
        value={depositBalance.slider}
        onChange={onSliderChange}
      />

      {/* Deposit / Approval Buttons */}
      <div>
        {pool.allowance === 0 ? (
          <div className={classes.showDetailButtonCon}>
            <Button
              className={classes.depositButton}
              color="primary"
              onClick={onApproval}
              disabled={fetchApprovalPending[index]}
            >
              {fetchApprovalPending[index]
                ? `${t('Vault-ApproveING')}`
                : `${t('Vault-ApproveButton')}`}
            </Button>
          </div>
        ) : (
          <div className={classes.showDetailButtonCon}>
            <Button
              className={classes.depositButton}
              onFocus={(event) => event.stopPropagation()}
              disabled={
                fetchDepositPending[index]
                || (new BigNumber(depositBalance.amount).toNumber() > balanceSingle.toNumber()
                || isMoreDepostLimit(new BigNumber(depositBalance.amount).toNumber(), pool.depostLimit))
              }
              onClick={() => onDeposit(false)}
            >
              {t('Vault-DepositButton')}
            </Button>

            {Boolean(pool.tokenAddress) && (
              <Button
                className={classes.depositButton}
                onFocus={(event) => event.stopPropagation()}
                disabled={
                  fetchDepositPending[index]
                  || (new BigNumber(depositBalance.amount).toNumber() > balanceSingle.toNumber()
                  || isMoreDepostLimit(balanceSingle.toNumber(), pool.depostLimit))
                }
                onClick={() => onDeposit(true)}
              >
                  {t('Vault-DepositButtonAll')}
              </Button>
            )}
          </div>
        )}
      </div>
    </Grid>
  )
}

export default DepositSection;