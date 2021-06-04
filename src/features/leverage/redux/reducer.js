import initialState from './initialState';
import { reducer as fetchBalancesReducer } from './fetchBalances';
import { reducer as fetchAllowancesReducer } from './fetchAllowances';
import { reducer as fetchPoolsDataReducer } from './fetchPoolsData';
import { reducer as fetchPositionsReducer } from './fetchPositions';
import { reducer as openPositionReducer } from './openPosition';
import { reducer as closePositionReducer } from './closePosition';

const reducers = [
  fetchBalancesReducer,
  fetchAllowancesReducer,
  fetchPoolsDataReducer,
  openPositionReducer,
  closePositionReducer,
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