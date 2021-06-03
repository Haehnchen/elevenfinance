import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { useSnackbar } from 'notistack';
import { approval } from 'features/web3';

import Dialog from 'components/Dialog/Dialog';
import Spinner from 'components/Spinner/Spinner';

import styles from './styles';
const useStyles = createUseStyles(styles);

const ApproveTokensDialog = ({ address, web3, tokens, isOpen, onClose, onComplete }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [isPending, setIsPending] = useState(false);
  const [pendingTokens, setPendingTokens] = useState([]);

  useEffect(() => {
    setPendingTokens(tokens);
  }, [tokens])

  const onApproval = (tokenAddress, spender) => {
    setIsPending(true);

    approval({ web3, address, tokenAddress, contractAddress: spender })
      .then(_ => {
        const newApprovals = [...pendingTokens];
        newApprovals.shift();

        if (newApprovals.length) {
          setPendingTokens(newApprovals);
        } else {
          if (onComplete) {
            onComplete();
          }
        }

        enqueueSnackbar(`Approval success`, { variant: 'success' });
      })
      .catch(error => {
        setIsPending(false);
      })
  }

  return (
    <Dialog open={isOpen}
      onClose={onClose}
      title={'Approve Tokens'}
    >
      {pendingTokens.length && (
        <div className={classes.token}>
          <div className={classes.image}>
            <img src={require(`images/${pendingTokens[0].image}`)}/>
          </div>
          <div>
            <div className={classes.name}>{ pendingTokens[0].token }</div>
            <button
              className={classes.button}
              onClick={() => onApproval(pendingTokens[0].address, pendingTokens[0].spender)}
              disabled={isPending}
            >
              {! isPending
                ? `${t('Vault-ApproveButton')}`
                : (<Spinner />)}
            </button>
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default ApproveTokensDialog;