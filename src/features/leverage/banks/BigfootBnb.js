import BigNumber from 'bignumber.js';
import { amountToUint, byDecimals } from 'features/helpers/bignumber';
import { fetchVaultTokenValue, fetchUniswapOutputAmount } from 'features/web3';

import bankAbi from 'features/configure/abis/bigfootBnbBank';

export default class BigfootBnb {

  /**
   * Open new leveraged position
   */
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

        const nativeTokenAmount = nativeTokenIndex !== -1
          ? amountToUint(amounts[nativeTokenIndex], 18)
          : 0;

        // Encode Bigfoot params
        const stratInfo = web3.eth.abi.encodeParameters(
          ['address', 'uint'],
          [pool.params.token, '0']
        );

        const bigfootInfo = web3.eth.abi.encodeParameters(
          ['address', 'uint', 'bytes'],
          [pool.params.strategy, 0, stratInfo]
        );

        // Send the transaction
        const contract = new web3.eth.Contract(bankAbi, bank.address);
        const tx = contract.methods.work(0, pool.bigfootAddress, loan, amountToUint(totalValue), bigfootInfo)
          .send({ from: address, value: nativeTokenAmount })

        resolve({ tx });
      })
    });
  }

  /**
   * Adjust existing leveraged position
   */
   adjustPosition({ address, web3, network, position, pool, bank, amounts }) {
    return new Promise((resolve, reject) => {
      // Convert all deposited tokens to bank's main token value
      const bankTokenValues = pool.tokens.map((token, index) => {
        return this.convertValueToBankToken({ token, amount: amounts[index], web3, network })
      });

      Promise.all(bankTokenValues).then(values => {
        // Calculate additional collateral value
        let totalValue = new BigNumber(0);
        values.map(value => totalValue = totalValue.plus(value));

        // Get native token amount for transaction value
        const nativeTokenIndex = pool.tokens.findIndex(token => token.address === null);

        const nativeTokenAmount = nativeTokenIndex !== -1
          ? amountToUint(amounts[nativeTokenIndex], 18)
          : 0;

        // Encode Bigfoot params
        const stratInfo = web3.eth.abi.encodeParameters(
          ['address', 'uint'],
          [pool.params.token, '0']
        );

        const bigfootInfo = web3.eth.abi.encodeParameters(
          ['address', 'uint', 'bytes'],
          [pool.params.strategy, 0, stratInfo]
        );

        // Send the transaction
        const contract = new web3.eth.Contract(bankAbi, bank.address);
        const tx = contract.methods.work(position.id, pool.bigfootAddress, '0', amountToUint(totalValue), bigfootInfo)
          .send({ from: address, value: nativeTokenAmount })

        resolve({ tx });
      })
    });
  }

  /**
   * Close leveraged position
   */
  closePosition({ address, web3, pool, bank, positionId }) {
    return new Promise((resolve, reject) => {

      // Encode params
      const stratInfo = web3.eth.abi.encodeParameters(
        ["address", "uint"],
        [pool.params.token, "0"]
      );

      const bigfootInfo = web3.eth.abi.encodeParameters(
        ["address", "uint", "bytes"],
        [pool.params.strategyLiquidation, 0, stratInfo]
      );

      // Send transaction
      const contract = new web3.eth.Contract(bankAbi, bank.address);
      const tx = contract.methods.work(positionId, pool.bigfootAddress, 0, "9999999999999999999999999999", bigfootInfo)
        .send({ from: address })

      resolve({ tx });

    });
  }

  /**
   * Liquidate leveraged position
   */
   liquidatePosition({ address, web3, bank, positionId }) {
    return new Promise((resolve, reject) => {
      const contract = new web3.eth.Contract(bankAbi, bank.address);
      const tx = contract.methods.kill(positionId)
        .send({ from: address })

      resolve({ tx });
    });
  }

  /**
   * Convert token to bank's main token
   */
  convertValueToBankToken({ token, amount, web3, network }) {
    if (! amount.gt(0) || token.address === null) {
      return Promise.resolve(amount);
    }

    return fetchVaultTokenValue({ address: token.address, decimals: token.decimals, web3, network })
      .then(value => {
        return amount.times(value);
      })
  }

  /**
   * Get price of bank's main token in USD
   *
   * @param {*} param0
   * @returns
   */
  getBankTokenPrice({ web3 }) {
    return fetchUniswapOutputAmount({
      web3,
      amountIn: amountToUint(1, 18),
      routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap
      path: [
        '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // BNB
        '0xe9e7cea3dedca5984780bafc599bd69add087d56', // BUSD
      ],
    }).then(res => {
      return byDecimals(res, 18);
    })
  }
}