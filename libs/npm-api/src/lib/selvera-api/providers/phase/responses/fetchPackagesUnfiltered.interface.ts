/**
 * Interface for GET /package (response)
 */

export interface FetchPackagesUnfiltered {
  id: string
  title: string
  shortcode: string
  organization: string
  organization_name: string
  created_at: string
  is_active: boolean
}
