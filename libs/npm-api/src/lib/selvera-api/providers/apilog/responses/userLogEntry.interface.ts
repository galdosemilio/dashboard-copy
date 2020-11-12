/**
 * User Log Entry
 */

export interface UserLogEntry {
  id: string
  account: string
  organization: string | null
  uri: string
  method: string
  authorized: boolean
  ipAddress: string
  userAgent: string
  createdAt: string
  elapsedTime: string
  appVersion: string
  appName: string
}
