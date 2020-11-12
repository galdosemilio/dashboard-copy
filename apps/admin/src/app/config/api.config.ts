/**
 * API Configuration
 */
import { ApiSettings } from '@coachcare/common/shared'

export const apiSettings: ApiSettings = {
  avatar: {
    default: './assets/avatar.png',
    path: '/account/:id/avatar'
  }
}
