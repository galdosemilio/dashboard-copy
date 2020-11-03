import { Entity } from '../../common/entities'

export interface UpdateAccountPasswordResponse {
  mfa: { channel: Entity }
  _links: { self: string; mfa: string }
}
