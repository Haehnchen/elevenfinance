import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import BigNumber from 'bignumber.js';
import { useSnackbar } from 'notistack';

import BankHelper from 'features/leverage/banks/BankHelper';
import { amountToUint } from 'features/helpers/bignumber';
import { useConnectWallet } from 'features/home/redux/hooks';
import { useFetchWithdraw } from 'features/vault/redux/hooks';

import AmountDialog from 'components/AmountDialog/AmountDialog';
import Select from 'components/Select/Select';
import { CashIcon } from '@heroicons/react/outline';

import styles from './styles';
const useStyles = createUseStyles(styles);

const MultiTokenWithdrawButton = ({ pool, tokens, balance, index }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { web3, address } = useConnectWallet();
  const { fetchWithdrawMultiToken, fetchWithdrawPending } = useFetchWithdraw();

  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [maxAmount, setMaxAmount] = useState(new BigNumber(0));
  const [selectedToken, setSelectedToken] = useState(0);
  const [tokensOptions, setTokensOptions] = useState([]);

  // Create list of available tokens for withdrawal
  useEffect(() => {
    const options = pool.tokens.map((token, index) => ({value: index, name: token.token}));
    setTokensOptions(options);
  }, [pool, tokens])

  // Convert pool's main token to selected withdrawal token
  useEffect(() => {
    const bankInstance = BankHelper.getBankInstance({ id: pool.bankId })
    bankInstance.convertWithdrawAmountToToken({
      web3,
      amount: balance,
      tokenIndex: selectedToken,
      tokenDecimals: pool.tokens[selectedToken].decimals
    })
      .then(tokenAmount => {
        setMaxAmount(tokenAmount);
      })
  }, [selectedToken]);

  const onWithdraw = (amount) => {
    if (!amount || amount == '0') {
      enqueueSnackbar(`Enter the amount to withdraw`, { variant: 'error' })
      return;
    }

    const amountValue = balance
      .times((new BigNumber(amount.replace(',', '')).div(maxAmount)))
      .dividedBy(pool.pricePerFullShare);

    fetchWithdrawMultiToken({
      address,
      web3,
      amount: amountToUint(amountValue, pool.itokenDecimals),
      tokenIndex: selectedToken,
      contractAddress: pool.earnContractAddress,
      index
    })
      .then(() => {
        setAmountDialogOpen(false);
        enqueueSnackbar(`Withdraw success`, { variant: 'success' })
      })
      .catch(error => enqueueSnackbar(`Withdraw error: ${error}`, { variant: 'error' }))
  }

  const onWithdrawButton = () => {
    setAmountDialogOpen(true);
  }

  const onAmountDialogClose = () => {
    setAmountDialogOpen(false);
  }

  return (
    <span>
      <button className={classes.buttonSecondary}
        onClick={onWithdrawButton}
      >
        {t('Vault-WithdrawButton')}
      </button>

      <AmountDialog
        tokensAmounts={[{
          token: pool.token,
          decimals: pool.tokenDecimals,
          balance: maxAmount
        }]}
        onConfirm={onWithdraw}

        title={'Withdraw from Bank'}
        buttonText={'Withdraw'}
        buttonIsLoading={fetchWithdrawPending[index]}

        open={amountDialogOpen}
        onClose={onAmountDialogClose}
      >
        <div className={classes.withdrawTokenSelectWrapper}>
          <div className={classes.label}>Select the token in which you want to receive your funds</div>

          <Select
            options={tokensOptions}
            selected={selectedToken}
            placeholder="Select Token"
            icon={<CashIcon />}
            onChange={value => setSelectedToken(value)}
            className={classes.withdrawTokenSelect}
            bgColor="dark"
          />
        </div>
      </AmountDialog>
    </span>
  )
};

export default MultiTokenWithdrawButton;