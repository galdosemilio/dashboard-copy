import { Entity } from '@coachcare/backend/services/shared';

export interface MessagingPreferenceSingle {
  id: string;
  isActive: boolean;
  organization: Entity;
}
