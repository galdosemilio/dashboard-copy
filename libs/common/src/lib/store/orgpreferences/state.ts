import { OrganizationPreferenceSingle } from '@coachcare/backend/services';
import { AppPalette, Palette } from '@coachcare/common/shared';

// ensure default assets in the store
export interface State extends Partial<OrganizationPreferenceSingle> {
  assets: {
    logoUrl: string;
    color: AppPalette;
  };
}

export const initialState: State = {
  displayName: 'CoachCare',
  assets: {
    logoUrl: '/assets/logo.png',
    color: Palette
  }
} as State;
