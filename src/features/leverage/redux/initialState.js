import { leverageOptions } from "../../configure/leverageOptions";

const tokens = {};

leverageOptions.map(({network, tokens: leverageOptionTokens})=> {
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
  leverageOptions,
  tokens,
  fetchLeverageBalancesDone: false,
  fetchLeverageBalancesPending: false,
};

export default initialState;