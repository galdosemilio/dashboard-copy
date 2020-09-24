import { Action } from '@ngrx/store';
import { State } from './state';

/**
 * Action Types
 */
export enum ActionTypes {
  LAYOUT_RESIZE = '@layout/resize',
  LAYOUT_UPDATE = '@layout/update',
  MENU_STATE = '@layout/menu/state',
  MENU_CLOSE = '@layout/menu/close',
  MENU_TOGGLE = '@layout/menu/toggle',
  PANEL_STATE = '@layout/panel/state',
  PANEL_TOGGLE = '@layout/panel/toggle',
  PANEL_ACTIVATION = '@layout/panel/enabled',
  PANEL_COMPONENT = '@layout/panel/component'
}

/**
 * Actions
 */
export class ResizeLayout implements Action {
  readonly type = ActionTypes.LAYOUT_RESIZE;
}
export class UpdateLayout implements Action {
  readonly type = ActionTypes.LAYOUT_UPDATE;

  constructor(public payload: Partial<State>) {}
}

export class OpenMenu implements Action {
  readonly type = ActionTypes.MENU_STATE;
  readonly payload = { opened: true };
}
export class CloseMenu implements Action {
  readonly type = ActionTypes.MENU_STATE;
  readonly payload = { opened: false };
}
export class CloseMenuFor implements Action {
  readonly type = ActionTypes.MENU_CLOSE;

  constructor(public payload: string) {}
}
export class ToggleMenu implements Action {
  readonly type = ActionTypes.MENU_TOGGLE;
}

export class OpenPanel implements Action {
  readonly type = ActionTypes.PANEL_STATE;
  readonly payload = { opened: true };
}
export class ClosePanel implements Action {
  readonly type = ActionTypes.PANEL_STATE;
  readonly payload = { opened: false };
}
export class ActivatePanel implements Action {
  readonly type = ActionTypes.PANEL_ACTIVATION;
  readonly payload = { enabled: true };
}
export class DeactivatePanel implements Action {
  readonly type = ActionTypes.PANEL_ACTIVATION;
  readonly payload = { enabled: false };
}
export class TogglePanel implements Action {
  readonly type = ActionTypes.PANEL_TOGGLE;
}

export class SetPanelComponent implements Action {
  readonly type = ActionTypes.PANEL_COMPONENT;

  constructor(public payload: { component: string }) {}
}

// Actions data type
export type Actions =
  | ResizeLayout
  | UpdateLayout
  | OpenMenu
  | CloseMenu
  | CloseMenuFor
  | ToggleMenu
  | OpenPanel
  | ClosePanel
  | ActivatePanel
  | DeactivatePanel
  | TogglePanel
  | SetPanelComponent;
