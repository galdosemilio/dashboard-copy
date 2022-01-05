import * as moment from 'moment'

export function measurementTableRowMapper(
  [current, previous],
  blockedDataPointAssocIds: string[]
) {
  const currentDate = moment(current.recordedAt.utc)
  const isEmpty = current.id === 'empty-group'

  const shouldShowDate =
    isEmpty ||
    this.listView ||
    (previous?.recordedAt.utc &&
      !currentDate.isSame(previous?.recordedAt.utc, 'day'))

  const shouldShowTime =
    !isEmpty ||
    this.listView ||
    (previous?.recordedAt.utc &&
      currentDate.isSame(previous?.recordedAt.utc, 'day'))

  const canBeDeleted = current.dataPoints.some(
    (dataPoint) => !blockedDataPointAssocIds.includes(dataPoint.type.id)
  )
  return { ...current, shouldShowDate, canBeDeleted, shouldShowTime }
}
