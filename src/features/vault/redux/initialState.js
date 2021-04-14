import { pools, categories } from "../../configure/pools";

const tokens = {};

pools.map(({token, tokenAddress, earnedToken, earnedTokenAddress})=> {
  tokens[token] = {
    tokenAddress: tokenAddress,
    tokenBalance: 0
  }
  tokens[earnedToken] = {
    tokenAddress: earnedTokenAddress,
    tokenBalance: 0
  }
  return '';
})

// console.log(tokens)

const initialState = {
  categories,
  pools,
  tokens,
  contractApy: {},
  fetchContractApyPending: false,
  fetchPoolBalancesPending: false,
  fetchBalancesPending: false,
  fetchApprovalPending: {},
  fetchDepositPending: {},
  fetchWithdrawPending: {},
};

export default initialState;