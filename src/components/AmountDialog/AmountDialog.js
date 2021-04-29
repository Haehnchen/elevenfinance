import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { byDecimals, calculateReallyNum, formatDecimals } from 'features/helpers/bignumber';
import { inputLimitPass, inputFinalVal } from 'features/helpers/utils';

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import CustomOutlinedInput from 'components/CustomOutlinedInput/CustomOutlinedInput';
import CustomSlider from 'components/CustomSlider/CustomSlider';

import styles from './styles';
const useStyles = makeStyles(styles);

const AmountDialog = ({ title, buttonText, buttonIsLoading, balance, decimals, open, onConfirm, onClose }) => {
  const classes = useStyles();

  const [amount, setAmount] = useState({
    number: 0,
    slider: 0
  });

  const onEnter = () => {
    setAmount({
      number: 0,
      slider: 0
    });
  }

  const onInputChange = event => {
    let value = event.target.value;
    const total = balance.toNumber();

    if (!inputLimitPass(value, decimals)) {
      return;
    }

    let sliderNum = 0;
    let inputVal = 0;
    if (value) {
      inputVal = Number(value.replace(/,/g, ''));
      sliderNum = byDecimals(inputVal / total, 0).toFormat(2) * 100;
    }

    setAmount({
      number: inputFinalVal(value, total, decimals),
      slider: sliderNum,
    });
  };

  const onSliderChange = (_, sliderNum) => {
    const total = balance.toNumber();

    let amount = 0;

    if (sliderNum >= 99) {
      amount = byDecimals(balance, 0).toFormat(decimals);
    } else if (sliderNum > 0) {
      amount = inputFinalVal(calculateReallyNum(total, sliderNum), total, decimals);
    }

    setAmount({
      number: amount,
      slider: sliderNum,
    });
  };

  const onBalanceButton = () => {
    setAmount({
      number: byDecimals(balance, 0).toFormat(decimals),
      slider: 100
    })
  }

  const onConfirmButton = () => {
    onConfirm((amount.number + '').replace(/,/g, ''));
  }

  return (
    <Dialog
      open={open}
      onEnter={onEnter}
      onClose={onClose}
      fullWidth
      maxWidth={'xs'}
      classes={{
        paper: classes.dialog
      }}
    >
      <DialogTitle className={classes.dialogTitle}>
        {title}

        <IconButton className={classes.dialogClose} onClick={onClose}>
            <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Balance */}
        <div className={classes.balance}>
          <span>Balance:</span>
          <Button className={classes.balanceButton}
            onClick={onBalanceButton}
          >
            {formatDecimals(balance)}
          </Button>
        </div>

        {/* Input */}
        <FormControl fullWidth variant="outlined">
          <CustomOutlinedInput
            value={amount.number}
            onChange={onInputChange}
          />
        </FormControl>

        {/* Slider */}
        <div className={classes.sliderWrapper}>
          <CustomSlider
            classes={{
              root: classes.sliderRoot,
              markLabel: classes.sliderMarkLabel,
            }}
            aria-labelledby="continuous-slider"
            value={amount.slider}
            onChange={onSliderChange}
          />
        </div>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Button
          className={classes.buttonPrimary}
          onClick={onConfirmButton}
          disabled={buttonIsLoading}
        >
          {!buttonIsLoading ? buttonText : (
            <CircularProgress
              className={classes.loader}
              size={20}
              thickness={6} />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AmountDialog;