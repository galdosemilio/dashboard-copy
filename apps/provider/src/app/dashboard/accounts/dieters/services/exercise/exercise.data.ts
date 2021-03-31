import { _ } from '@app/shared'
import { ExerciseType } from '@coachcare/npm-api'
import * as moment from 'moment'

export interface Duration {
  amount: number
  unit: moment.unitOfTime.DurationConstructor
  unitString: string
}

export class ExerciseData {
  date: string
  exerciseType: ExerciseType
  intensity: number
  duration: Duration = {
    amount: undefined,
    unit: 'minutes',
    // For now, this value is fixed, but in the future, the units may vary
    unitString: _(`GLOBAL.MINUTES`)
  }
  notes?: string

  constructor(args: any) {
    this.date = args.activitySpan.start || args.createdAt
    this.exerciseType = args.exerciseType
    this.intensity = args.intensity
    this.notes = args.note

    if (args.activitySpan.start && args.activitySpan.end) {
      this.duration = Object.assign(this.duration, {
        amount: this.calculateDuration(
          args.activitySpan.start,
          args.activitySpan.end,
          this.duration.unit
        )
      })
    }
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
