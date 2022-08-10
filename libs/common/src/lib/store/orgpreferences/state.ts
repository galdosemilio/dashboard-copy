import { OrganizationPreferenceSingle } from '@coachcare/sdk'
import { AppPalette, Palette } from '@coachcare/common/shared'

// ensure default assets in the store
export interface State extends Partial<OrganizationPreferenceSingle> {
  assets: {
    logoUrl: string
    color: AppPalette
    faviconUrl?: string
    iconUrl?: string
    splashUrl?: string
  }
  storeUrl: string
}

export const initialState: State = {
  displayName: 'CoachCare',
  assets: {
    logoUrl: '/assets/logo.png',
    color: Palette
  },
  storeUrl: ''
} as State
