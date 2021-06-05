import initialState from './initialState';
import { reducer as adjustPositionReducer } from './adjustPosition';
import { reducer as fetchAllowancesReducer } from './fetchAllowances';
import { reducer as fetchBalancesReducer } from './fetchBalances';
import { reducer as fetchBanksTokensPricesReducer } from './fetchBanksTokensPrices';
import { reducer as fetchPoolsDataReducer } from './fetchPoolsData';
import { reducer as fetchPositionsReducer } from './fetchPositions';
import { reducer as openPositionReducer } from './openPosition';
import { reducer as closePositionReducer } from './closePosition';
import { reducer as liquidatePositionReducer } from './liquidatePosition';

const reducers = [
  adjustPositionReducer,
  fetchAllowancesReducer,
  fetchBalancesReducer,
  fetchBanksTokensPricesReducer,
  fetchPoolsDataReducer,
  fetchPositionsReducer,
  openPositionReducer,
  closePositionReducer,
  liquidatePositionReducer,
];


export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}