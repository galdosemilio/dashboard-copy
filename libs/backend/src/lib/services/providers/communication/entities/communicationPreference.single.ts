import { Entity } from '@coachcare/backend/services/shared';

export interface CommunicationPreferenceSingle {
  id: string;
  isActive: boolean;
  organization: Entity;
  videoConferencing: {
    isEnabled: boolean;
  };
}
