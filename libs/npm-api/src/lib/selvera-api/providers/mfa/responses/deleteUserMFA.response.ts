import { Entity } from '../../common/entities'

export interface DeleteUserMFAResponse {
  mfa?: { channel: Entity }
  _links?: { self: string; mfa: string }
}
