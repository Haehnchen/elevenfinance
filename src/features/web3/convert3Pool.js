import { byDecimals } from 'features/helpers/bignumber';

const nerveAddress = '0x1B3771a66ee31180906972580adE9b81AFc5fCDc';
const nerveAbi = [
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }, { "internalType": "uint8", "name": "tokenIndex", "type": "uint8" }], "name": "calculateRemoveLiquidityOneToken", "outputs": [{ "internalType": "uint256", "name": "availableTokenAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }, { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }, { "internalType": "bool", "name": "deposit", "type": "bool" }], "name": "calculateTokenAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

export const convert3PoolToUsd = async ({ web3, address, amount, usdTokenIndex }) => {
  const contract = new web3.eth.Contract(nerveAbi, nerveAddress);
  const data = await contract.methods.calculateRemoveLiquidityOneToken(
    address,
    amount,
    usdTokenIndex
  ).call({ from: address });

  return data;
};

export const convertUsdTo3Pool = async ({ web3, address, amount, usdTokenIndex }) => {
  const amounts = ['0', '0', '0'];
  amounts[usdTokenIndex] = amount;

  const contract = new web3.eth.Contract(nerveAbi, nerveAddress);
  const data = await contract.methods.calculateTokenAmount(
    nerveAddress,
    amounts,
    true
  ).call({ from: address });

  return byDecimals(data, 18);
};