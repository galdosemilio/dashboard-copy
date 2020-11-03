import { Entity } from '../../common/entities'

export interface UpdatePasswordResponse {
  mfa: { channel: Entity }
  _links: { self: string; mfa: string }
}
