import { NamedEntity } from '../../common/entities'
import { Section } from '../entities'

/**
 * Interface for GET /mfa/preference
 */

export interface GetMFAOrganizationPreferenceResponse {
  /** ID of the MFA preference instance */
  id: string
  /** Determines if the MFA preference is active or not */
  isActive: boolean
  /**
   * Organization associated with the preference instance, it can be different from the current
   * organization in case of inheritance
   */
  organization: NamedEntity
  /** Sections of the preference that atomically describe the MFA requiredness configuration */
  sections: Section[]
}
