/**
 * PATCH /organization/:id/preference
 */

import { AppIds, Color } from '../entities'

export interface UpdateOrganizationPreferenceRequest {
  /** The id of the organization. */
  id: string
  /** Logo filename. */
  logoFilename?: string
  /** Logo baseURL. */
  logoBaseUrl?: string
  /** Display name. */
  displayName?: string
  /** App IDs. */
  appIds?: AppIds
  /** Reset password baseUrl. */
  resetPasswordBaseUrl?: string
  /** Color palette. */
  color?: Partial<Color>
  /** MALA settings. */
  mala?: any
  /** Clinic code help text */
  clinicCodeHelp?: { locale: string; content: string }[]
  iconFilename?: string
  splashFilename?: string
  /** Onboarding 'phase 0' flow information */
  onboarding?: { client: { packages: [] } }
  /** Open association information */
  openAssociation?: { client: boolean }
  /** Indicates whether the active campaign is enabled or not */
  useActiveCampaign?: boolean
}
