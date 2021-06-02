import BigNumber from 'bignumber.js';
import { amountToUint } from 'features/helpers/bignumber';
import { fetchVaultTokenValue } from 'features/web3';

import bankAbi from 'features/configure/abis/bigfootBnbBank';

export default class BigfootBnb {

  // Open new leveraged position
  openPosition({ address, web3, network, pool, bank, amounts, leverage }) {
    return new Promise((resolve, reject) => {
      // Convert all deposited tokens to bank's main token value
      const bankTokenValues = pool.tokens.map((token, index) => {
        return this.convertValueToBankToken({ token, amount: amounts[index], web3, network })
      });

      Promise.all(bankTokenValues).then(values => {
        // Calculate total collateral value and loan size
        let totalValue = new BigNumber(0);
        values.map(value => totalValue = totalValue.plus(value));

        const loan = amountToUint(totalValue.times(leverage - 1));

        if (totalValue.lt(bank.minPositionSize)) {
          reject(`Min position size is ${bank.minPositionSize} ${bank.currency} (or the equivalent in other assets)`);
          return;
        }

        // Get native token amount for transaction value
        const nativeTokenIndex = pool.tokens.findIndex(token => token.address === null);
        const nativeTokenAmount = nativeTokenIndex
          ? amountToUint(amounts[nativeTokenIndex], 18)
          : 0;

        // Encode Bigfoot params
        const stratInfo = web3.eth.abi.encodeParameters(
          ['address', 'uint'],
          [pool.params.token, '0']
        );

        const bigfootInfo = web3.eth.abi.encodeParameters(
          ['address', 'uint', 'bytes'],
          [pool.params.zapper, amountToUint(amounts[0], pool.tokens[0].decimals), stratInfo]
        );

        // Send the transaction
        const contract = new web3.eth.Contract(bankAbi, bank.address);
        const tx = contract.methods.work(0, pool.bigfootAddress, loan, amountToUint(totalValue), bigfootInfo)
          .send({ from: address, value: nativeTokenAmount })

        resolve({ tx });
      })
    });
  }

  // Convert token to bank's main token
  convertValueToBankToken({ token, amount, web3, network }) {
    if (! amount.gt(0) || token.address === null) {
      return Promise.resolve(amount);
    }

    return fetchVaultTokenValue({ address: token.address, decimals: token.decimals, web3, network })
      .then(value => {
        return amount.times(value);
      })
  }

}