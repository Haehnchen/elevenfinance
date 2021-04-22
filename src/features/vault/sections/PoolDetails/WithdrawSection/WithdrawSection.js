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
import { useFetchWithdraw } from 'features/vault/redux/hooks';

import styles from './styles';
const useStyles = makeStyles(styles);

const WithdrawSection = ({ pool, index, sharesBalance }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchWithdraw, fetchWithdrawEth, fetchWithdrawPending } = useFetchWithdraw();

  const [withdrawAmount, setWithdrawAmount] = useState({
    amount: 0,
    slider: 0,
  });

  const depositedLpValue = sharesBalance.times(pool.pricePerFullShare);

  const onWithdraw = isAll => {
    if (isAll) {
      setWithdrawAmount({
        amount:forMat(sharesBalance),
        slider: 100,
      })
    }

    let amountValue = withdrawAmount.amount
      ? withdrawAmount.amount.replace(',', '')
      : withdrawAmount.amount;

    if (pool.tokenAddress) {
      fetchWithdraw({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue)
          .multipliedBy(new BigNumber(10).exponentiatedBy(pool.itokenDecimals))
          .toString(10),
        contractAddress: pool.earnContractAddress,
        index
      })
        .then(() => enqueueSnackbar(`Withdraw success`, { variant: 'success' }))
        .catch(error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' }))
    } else {
      fetchWithdrawEth({
        address,
        web3,
        isAll,
        amount: new BigNumber(amountValue)
          .multipliedBy(new BigNumber(10).exponentiatedBy(pool.itokenDecimals))
          .toString(10),
        contractAddress: pool.earnContractAddress,
        index
      })
        .then(() => enqueueSnackbar(`Withdraw success`, { variant: 'success' }))
        .catch(error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' }))
    }
  }

  const onInputChange = event => {
    const value = event.target.value;
    const total = sharesBalance.toNumber();

    if (!inputLimitPass(value, pool.itokenDecimals)) {
      return;
    }

    let inputVal = 0;
    let sliderNum = 0;
    if (value) {
      inputVal = Number(value.replace(',', ''));
      sliderNum = Math.round(byDecimals(inputVal / total, 0).toNumber() * 100);
    }

    setWithdrawAmount({
      amount: inputFinalVal(value, total, pool.itokenDecimals),
      slider: sliderNum,
    });
  };

  const onSliderChange = (_, sliderNum) => {
    const total = sharesBalance.toNumber();

    setWithdrawAmount({
      amount: sliderNum === 0 ? 0 : calculateReallyNum(total, sliderNum),
      slider: sliderNum,
    });
  };

  return (
    <Grid item xs={12} sm={6} md={pool.claimable ? 5 : 6} className={classes.sliderDetailContainer}>
      {/* Balance */}
      <div className={classes.poolBalanceBlock}>
        <div>{t('Vault-ListDeposited')}</div>
        <div className={classes.poolBalance}>
          <div>
            {formatDecimals(sharesBalance)}
            {pool.price && (
              <span>
                &nbsp; (${depositedLpValue.times(pool.price).toFixed(2)})
              </span>
            )}
          </div>
          <div className={classes.poolBalanceDescription}>
            {formatDecimals(depositedLpValue)} {pool.token}
          </div>
        </div>
      </div>

      {/* Input */}
      {!pool.isV1 && (
        <FormControl fullWidth variant="outlined">
          <CustomOutlinedInput
            value={withdrawAmount.amount}
            onChange={onInputChange}
          />
        </FormControl>
      )}

      {/* Slider */}
      {!pool.isV1 && (
        <CustomSlider
          classes={{
            root: classes.drawSliderRoot,
            markLabel: classes.drawSliderMarkLabel,
          }}
          aria-labelledby="continuous-slider"
          value={withdrawAmount.slider}
          onChange={onSliderChange}
        />
      )}

      {/* Withdraw Buttons */}
      <div className={classes.showDetailButtonCon}>
        {!pool.isV1 && (
          <Button
            className={classes.withdrawButton}
            disabled={fetchWithdrawPending[index]}
            onClick={() => onWithdraw(false)}
          >
            {fetchWithdrawPending[index]
              ? `${t('Vault-WithdrawING')}`
              : `${t('Vault-WithdrawButton')}`}
          </Button>
        )}

        <Button
          className={classes.withdrawButton}
          disabled={fetchWithdrawPending[index]}
          onClick={() => onWithdraw(true)}
        >
          {fetchWithdrawPending[index]
            ? `${t('Vault-WithdrawING')}`
            : `${t('Vault-WithdrawButtonAll')}`}
        </Button>
      </div>
    </Grid>
  );
}

export default WithdrawSection;