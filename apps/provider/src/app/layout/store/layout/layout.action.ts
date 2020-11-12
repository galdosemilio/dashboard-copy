import { Action } from '@ngrx/store'

import { UILayoutState } from './layout.state'

/**
 * Action Types
 */
export const LAYOUT_INIT = '[UI.LAYOUT] init'
export const LAYOUT_RESIZE = '[UI.LAYOUT] resize'
export const LAYOUT_UPDATE = '[UI.LAYOUT] update'
export const MENU_STATE = '[UI.LAYOUT] menu/state'
export const MENU_CLOSE = '[UI.LAYOUT] menu/close'
export const MENU_TOGGLE = '[UI.LAYOUT] menu/toggle'
export const PANEL_STATE = '[UI.LAYOUT] panel/state'
export const PANEL_TOGGLE = '[UI.LAYOUT] panel/toggle'
export const PANEL_ACTIVATION = '[UI.LAYOUT] panel/enabled'
export const PANEL_COMPONENT = '[UI.LAYOUT] panel/component'

/**
 * Actions
 */
export class InitLayout implements Action {
  readonly type = LAYOUT_INIT
}
export class ResizeLayout implements Action {
  readonly type = LAYOUT_RESIZE
}
export class UpdateLayout implements Action {
  readonly type = LAYOUT_UPDATE

  constructor(public payload: Partial<UILayoutState>) {}
}

export class OpenMenu implements Action {
  readonly type = MENU_STATE
  readonly payload = { opened: true }
}
export class CloseMenu implements Action {
  readonly type = MENU_STATE
  readonly payload = { opened: false }
}
export class CloseMenuFor implements Action {
  readonly type = MENU_CLOSE

  constructor(public payload: string) {}
}
export class ToggleMenu implements Action {
  readonly type = MENU_TOGGLE
}

export class OpenPanel implements Action {
  readonly type = PANEL_STATE
  readonly payload = { opened: true }
}
export class ClosePanel implements Action {
  readonly type = PANEL_STATE
  readonly payload = { opened: false }
}
export class ActivatePanel implements Action {
  readonly type = PANEL_ACTIVATION
  readonly payload = { enabled: true }
}
export class DeactivatePanel implements Action {
  readonly type = PANEL_ACTIVATION
  readonly payload = { enabled: false }
}
export class TogglePanel implements Action {
  readonly type = PANEL_TOGGLE
}

export class SetPanelComponent implements Action {
  readonly type = PANEL_COMPONENT

  constructor(public payload: { component: string }) {}
}

// Actions data type
export type layActions =
  | InitLayout
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
  | SetPanelComponent
