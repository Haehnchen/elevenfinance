import { vaultFarmAbi } from '../configure/abi';
import bigfootUsdBankABI from '../configure/abis/bigfootUsdBank';
import BigNumber from 'bignumber.js';

const BIGFOOT_USD_BANK = '0xE9B3017cd7A347a8B0324F88db335255E5c5D3FD';

export const fetchPendingReward = async ({ web3, address, earnContractAddress, tokenName }) => {
  // Use separate ABI for Bigfoot USD bank
  const abi = earnContractAddress == BIGFOOT_USD_BANK
    ? bigfootUsdBankABI
    : vaultFarmAbi;

  if (tokenName == 'Eleven' && earnContractAddress == BIGFOOT_USD_BANK) {
    tokenName = 'Ele';
  }

  const contract = new web3.eth.Contract(abi, earnContractAddress);
  const reward = await contract.methods['pending' + tokenName](address).call({ from: address });

  return new BigNumber(reward);
}