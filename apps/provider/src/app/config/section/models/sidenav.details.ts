import { SidenavOptions } from '../consts/sidenav-options'

export interface SidenavDetails {
  HIDDEN_OPTIONS?: SidenavOptions[]
  SHOWN_OPTIONS?: SidenavOptions[]
  PATIENT_HIDDEN_OPTIONS?: SidenavOptions[]
  PATIENT_SHOWN_OPTIONS?: SidenavOptions[]
  FETCH_STORE_LINK?: boolean
  STORE_NAV_NAME?: string
}
