/**
 * Interface for GET /food/consumed
 */

export interface FetchAllConsumedRequest {
  filter?: string
  account?: number
  type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  offset?: number
  noLimit?: boolean
  startDate?: string
  endDate?: string
}
