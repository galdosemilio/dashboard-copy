import { Meeting } from '@app/shared/model'
import * as moment from 'moment'
import { determineRecurringDeleteTimestamp } from './recurring-delete-after'

const meeting = {
  time: moment().add(3, 'day')
} as Meeting

describe('Determine Recurring Delete Timestamp', function () {
  describe('1. recurring', function () {
    it('should return meeting timestamp', function () {
      const now = moment()
      const res = determineRecurringDeleteTimestamp(
        meeting,
        now.clone().add(2, 'day'),
        'recurring',
        now
      )

      expect(meeting.time.diff(res, 'second')).toEqual(1)
    })
  })

  describe('2. recurringAfter', function () {
    it('should return the meeting timestamp if the meeting is set in the future', function () {
      const deleteAfter = moment().add(2, 'day')
      const res = determineRecurringDeleteTimestamp(
        meeting,
        deleteAfter,
        'recurringAfter'
      )

      expect(res.isSame(deleteAfter)).toBe(true)
    })

    it('should return a timestamp 1 minute after the meeting timestamp for the meeting on the same day as the reference', function () {
      const now = moment()
      const deleteAfter = now.clone().startOf('day')
      const res = determineRecurringDeleteTimestamp(
        meeting,
        deleteAfter,
        'recurringAfter'
      )

      expect(res.diff(now, 'minute')).toEqual(1)
    })
  })
})
