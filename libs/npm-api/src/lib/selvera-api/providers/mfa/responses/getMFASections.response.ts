/**
 * Interface for /mfa/preference/section
 */

import { NamedEntity } from '../../common/entities'

export interface GetMFASectionsResponse {
  /** Available sections for a specific organization */
  data: NamedEntity[]
}
