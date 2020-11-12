/**
 * OrganizationPreferences
 */

import { AccountTypeIds } from '../../account/entities'
import { Color } from './color.interface'

export interface OrganizationAssets {
  /** Full URL of the logo */
  logoUrl?: string
  /** Full URL of the home screen icon */
  iconUrl?: string
  /** Full URL of the splash screen image */
  splashUrl?: string
  /** Full URL of the favicon */
  faviconUrl?: string
  /** Color information */
  color: Color
}

export interface OrganizationFoodMode {
  id: string
  description: string
  isActive: boolean
}

export interface OrganizationMala {
  /** The iOS bundle ID */
  iosBundleId?: string
  /** The Android bundle ID */
  androidBundleId?: string
  /** The app name */
  appName?: string
  /** The firebase proejct name */
  firebaseProjectName?: string
  /** The app store connect team ID */
  appStoreConnectTeamId?: string
  /** The developer portal team ID */
  developerPortalTeamId?: string
  /** Any remaining MALA settings, that will be merged into the output for the "mala" key */
  other?: any
}

export interface OrganizationScheduling {
  id: string
  disabledFor: Array<AccountTypeIds>
}

export interface OrganizationPreferences extends OrganizationAssets {
  id: string
}
