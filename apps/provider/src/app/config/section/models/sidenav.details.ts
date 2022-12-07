import { SidenavOptions } from '../consts/sidenav-options'

export interface SidenavDetails {
  HIDDEN_OPTIONS?: SidenavOptions[]
  SHOWN_OPTIONS?: SidenavOptions[]
  PATIENT_HIDDEN_OPTIONS?: SidenavOptions[]
  PATIENT_SHOWN_OPTIONS?: SidenavOptions[]
  STORE_CLINIC_USES_SHOPIFY?: boolean
  STORE_CLINIC_NAV_NAME?: string
}
