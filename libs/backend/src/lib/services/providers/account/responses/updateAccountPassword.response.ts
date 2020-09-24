import { Entity } from '@coachcare/backend/services/shared';

export interface UpdateAccountPasswordResponse {
  mfa: { channel: Entity };
  _links: { self: string; mfa: string };
}
