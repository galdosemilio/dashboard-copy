import { MFAToken } from '../../common/entities'

export interface VerifyDeleteUserMFARequest {
  /** MFA authentication instance ID */
  id: string
  /** MFA token */
  token: MFAToken
}
