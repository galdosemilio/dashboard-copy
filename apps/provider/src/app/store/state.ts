import { CCRConfig } from '@app/config';
import { RouterStateType } from './router/index';

export interface AppState {
  config: CCRConfig;
  router: RouterStateType;
}
