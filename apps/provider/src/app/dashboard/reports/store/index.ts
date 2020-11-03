export * from './controls/index';
export * from './selector';
export * from './state';

import { reducers } from './reducer';
import { name } from './selector';

export const store = {
  name,
  reducers,
  config: {}
};
