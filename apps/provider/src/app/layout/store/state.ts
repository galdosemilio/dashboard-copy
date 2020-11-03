import { CallState } from '@app/layout/store/call/call.state';
import { UILayoutState } from './layout/layout.state';
import { UIResponsiveState } from './responsive/responsive.state';

export interface UIState {
  layout: UILayoutState;
  responsive: UIResponsiveState;
  call: CallState;
}
