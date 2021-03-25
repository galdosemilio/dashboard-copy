/**
 * Synced service date
 */

import { AuthenticationTitle } from './service.interface'

export interface SyncedDeviceDate {
  id: string
  title: AuthenticationTitle
  description: string
  service?: string
  lastAuthenticatedAt?: string // timestamp
  lastSyncedAt?: string // timestamp
}
