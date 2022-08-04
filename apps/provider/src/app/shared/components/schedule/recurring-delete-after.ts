import * as moment from 'moment'

export const determineRecurringDeleteTimestamp = (
  selectedTimestamp: moment.Moment,
  mode: 'recurringAfter' | 'recurring',
  reference = moment()
): moment.Moment => {
  if (mode === 'recurring') {
    return reference.clone().add(1, 'minute')
  }

  if (selectedTimestamp.isSame(reference, 'day')) {
    return reference.clone().add(1, 'minute')
  }

  return selectedTimestamp
}
