import initialState from './initialState';
import { reducer as fetchBalancesReducer } from './fetchBalances';
import { reducer as fetchLeverageBalancesReducer } from './fetchLeverageBalances';
import { reducer as fetchPoolsDataReducer } from './fetchPoolsData';

const reducers = [
  fetchBalancesReducer,
  fetchLeverageBalancesReducer,
  fetchPoolsDataReducer,
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