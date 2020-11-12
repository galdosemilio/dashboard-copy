/**
 * Interface for GET /meeting/attendance/status
 */

export interface FetchAllAttendanceStatusEntriesRequest {
  /** Pagination limit */
  limit: number | 'all'
  /** Pagination offset */
  offset: number
  /** Attendance status entry filter */
  status: 'active' | 'inactive' | 'all'
}
