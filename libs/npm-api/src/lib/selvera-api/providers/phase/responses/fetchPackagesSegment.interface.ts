/**
 * Interface for GET /package (response)
 */

export interface FetchPackagesSegment {
  id: string
  title: string
  shortcode: string
  organization: {
    id: string
    name: string
  }
  createdAt: string
  isActive: boolean
}
