import { banks, pools } from "../../configure/leverage";

const tokens = {};

pools.map(({network, tokens: leverageOptionTokens})=> {
  leverageOptionTokens.map(token => {
    tokens[token.token] = {
      network: network,
      tokenAddress: token.address,
      tokenBalance: 0
    }
  })
  return '';
})

const initialState = {
  banks,
  pools,
  tokens,
  positions: [],
  openPositionPending: {},
  fetchBalancesDone: false,
  fetchBalancesPending: false,
  fetchAllowancesDone: false,
  fetchAllowancesPending: false,
  fetchPoolsDataDone: false,
  fetchPoolsDataPending: false,
  fetchPositionsDone: false,
  fetchPositionsPending: false,
};

export default initialState;