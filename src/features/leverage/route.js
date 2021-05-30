import { LeveragePage } from '.';

export default {
  path: 'leverage',
  childRoutes: [
    { path: ':category?', component: LeveragePage, isIndex: true },
  ],
};
