import * as moment from 'moment'

// TODO move to npm-api
export interface PainSingle {
  reportedAt: string
  region: string
  duration?: any
  intensity: number
  description: string
}

export interface PainRow extends PainSingle {
  duration: string
  intensityText: string
  typeText: string
}

export interface PainType {
  id: number
  description: string
}

export class PainData {
  date: string
  details: Array<PainRow> = []

  constructor(row: PainSingle) {
    this.date = moment(row.reportedAt).format('YYYY-MM-DD')
    this.addRow(row)
  }

  addRow(row: PainSingle) {
    // TODO figure out the side depending on the Location coordinates?
    const data: PainRow = {
      ...row,
      // duration to moment
      duration: row.duration
        ? moment.duration(row.duration).humanize()
        : undefined,
      // translate intensity text
      intensityText: this.txtIntensity(row.intensity),
      // resolve pain type text
      typeText: row.description
    }
    this.details.push(data)
  }

  private txtIntensity(level: number) {
    const intensities = {
      1: 'Mild',
      2: 'Soft',
      3: 'Moderate',
      4: 'Hard',
      5: 'Severe'
    }
    return intensities[level]
  }

  private calculateDuration(
    startTime: string,
    endTime: string,
    unit: moment.unitOfTime.DurationConstructor
  ): number {
    const start = moment(startTime),
      end = moment(endTime)
    return end.diff(start, unit)
  }
}
