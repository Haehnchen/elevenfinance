import { MultiCall } from 'eth-multicall';
import { getNetworkMulticall, getNetworkWrappedNativeToken } from 'features/helpers/getNetworkData';
import { byDecimals } from 'features/helpers/bignumber';

import { earnContractABI, erc20ABI } from 'features/configure';

export const fetchVaultTokenValue = async ({ address, decimals, web3, network }) => {
  const multicall = new MultiCall(web3, getNetworkMulticall(network));

  // Get Vault's price per share and underlying token
  const vaultContract = new web3.eth.Contract(earnContractABI, address)
  const vaultCalls = [{
    pricePerShare: vaultContract.methods.getPricePerFullShare(),
    token: vaultContract.methods.token()
  }];

  const vaultData = await multicall.all([vaultCalls]);
  const pricePerShare = byDecimals(vaultData[0][0].pricePerShare, decimals);
  const tokenAddress = vaultData[0][0].token;

  // Get native token balance and total supply of th LP token
  const lpCalls = [];

  const nativeTokenContract = new web3.eth.Contract(erc20ABI, getNetworkWrappedNativeToken(network));
  lpCalls.push({
    nativeTokenBalance: nativeTokenContract.methods.balanceOf(tokenAddress)
  })

  const lpContract = new web3.eth.Contract(erc20ABI, tokenAddress);
  lpCalls.push({
    supply: lpContract.methods.totalSupply()
  });

  const data = await multicall.all([lpCalls]);
  const nativeTokenBalance = byDecimals(data[0][0].nativeTokenBalance, 18).times(2)
  const totalSupply = byDecimals(data[0][1].supply, 18);

  // Calculate vault-token price in native tokens
  return nativeTokenBalance.div(totalSupply).times(pricePerShare);
}