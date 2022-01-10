import * as moment from 'moment'

export function measurementTableRowMapper(
  [current, previous],
  blockedDataPointAssocIds: string[],
  listView = false
) {
  const currentDate = moment(current.recordedAt.utc)
  const isEmpty = current.id === 'empty-group'

  const shouldShowDate =
    isEmpty ||
    listView ||
    (previous?.recordedAt.utc &&
      !currentDate.isSame(previous?.recordedAt.utc, 'day'))

  const shouldShowTime =
    !isEmpty ||
    listView ||
    (previous?.recordedAt.utc &&
      currentDate.isSame(previous?.recordedAt.utc, 'day'))

  const canBeDeleted = current.dataPoints.some(
    (dataPoint) => !blockedDataPointAssocIds.includes(dataPoint.type.id)
  )
  return { ...current, shouldShowDate, canBeDeleted, shouldShowTime }
}
