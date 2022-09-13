import { Meeting } from '@app/shared/model'
import * as moment from 'moment'

export const determineRecurringDeleteTimestamp = (
  meeting: Meeting,
  selectedTimestamp: moment.Moment,
  mode: 'recurringAfter' | 'recurring',
  reference = moment()
): moment.Moment => {
  if (mode === 'recurring') {
    return meeting.time.clone().subtract(1, 'second')
  }

  if (selectedTimestamp.isSame(reference, 'day')) {
    return reference.clone().add(1, 'minute')
  }

  return selectedTimestamp
}
