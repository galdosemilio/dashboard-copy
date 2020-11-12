/**
 * User Log Unfiltered Entry
 */

export interface UserLogUnfiltered {
  id: string
  account_id: string
  organization_id: string | null
  uri: string
  method: string
  authorized: string
  ip_address: string
  user_agent: string
  created_on: string
  elapsed_time: string
  app_version: string
  app_name: string
}
