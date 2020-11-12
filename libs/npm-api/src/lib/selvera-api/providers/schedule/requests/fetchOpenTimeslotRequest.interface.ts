/**
 * Interface for GET /meeting/scheduler
 */

export interface FetchOpenTimeslotRequest {
  accounts?: Array<string>
  duration: number // number of minutes required for meeting
  end?: string // The upper bound of the range of available timeslots. Defaults to `start` + 1 day.
  overlap?: number // Allowed 'overlap' of availability blocks in minutes. For example, overlap of 15 minutes means the blocks can overlap every 15 minutes (e.g. 07:00 - 08:00, 07:15 - 08:15 for `duration=60`). Cannot be < 15. If it's longer than `duration`, it will be by default clamped to the value of `duration`.
  start?: string // The lower bound of the range of available timeslots. Defaults to 'now'. If it's not provided, but `end` is provided, it defaults to `end` - 1 day.
  timezone?: string // The timezone to request the data in. Defaults to calling user's timezone.
}
