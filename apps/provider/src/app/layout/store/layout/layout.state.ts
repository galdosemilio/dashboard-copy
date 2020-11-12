/**
 * UI Layout State.
 */

export interface UILayoutState {
  menu: {
    opened: boolean
  }
  panel: {
    opened: boolean
    enabled: boolean
    component: string
  }
}

export const initialLayoutState: UILayoutState = {
  menu: {
    opened: false
  },
  panel: {
    opened: false,
    enabled: false,
    component: ''
  }
}
