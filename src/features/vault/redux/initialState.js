import { pools, categories } from "../../configure/pools";

const tokens = {};

pools.map(({token, tokenAddress, earnedToken, earnedTokenAddress})=> {
  tokens[token] = {
    tokenAddress: tokenAddress,
    tokenBalance: 0
  }

  if (earnedTokenAddress != tokenAddress) {
    tokens[earnedToken] = {
      tokenAddress: earnedTokenAddress,
      tokenBalance: 0
    }
  }
  return '';
})

// console.log(tokens)

const initialState = {
  categories,
  pools,
  tokens,
  filters: {
    categories: [],
    deposited: false,
    withBalance: false,
    sort: 'default'
  },
  pendingRewards: {},
  contractApy: {},
  farmAllowance: {},
  fetchContractApyPending: false,
  fetchPoolBalancesDone: false,
  fetchPoolBalancesPending: false,
  fetchBalancesDone: false,
  fetchBalancesPending: false,
  fetchFarmsStakedDone: false,
  fetchFarmsStakedPending: false,
  fetchFarmClaimPending: {},
  fetchFarmStakePending: {},
  fetchFarmUnstakePending: {},
  fetchApprovalPending: {},
  fetchFarmAllowanceDone: {},
  fetchPoolRewardsDone: {},
  fetchPoolRewardsPending: {},
  fetchFarmAllowancePending: {},
  fetchFarmApprovalPending: {},
  fetchClaimPending: {},
  fetchDepositPending: {},
  fetchWithdrawPending: {},
};

export default initialState;