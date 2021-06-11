import { amountToUint, byDecimals } from 'features/helpers/bignumber';
import { convertCurve3Pool } from 'features/web3';

import eleBankABI from 'features/configure/abis/eleBank';

export default class eleUsd {

  /**
   * Convert withdrawal amount from bank's main token to selected withdrawal token
   *
   * @param {*} param0
   * @returns
   */
  convertWithdrawAmountToToken({ web3, amount, tokenIndex, tokenDecimals }) {
    const inputTokenIndex = 1;
    const inputTokenDecimals = 6;

    if (amount.gt(0) && tokenIndex != inputTokenIndex) {
      amount = amountToUint(amount, inputTokenDecimals);

      return convertCurve3Pool({ web3, inputTokenIndex, outputTokenIndex: tokenIndex, amount })
        .then(outputAmount => {
          return byDecimals(outputAmount, tokenDecimals);
        })
    }

    return Promise.resolve(amount);
  }
}