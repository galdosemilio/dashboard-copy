import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import * as moment from 'moment-timezone'
import { BehaviorSubject, Observable } from 'rxjs'
import { PainSingle } from './pain.data'

// TODO move to npm-api
export type GetAllPainRequest = {
  account: string
  startDate: string
  endDate?: string
  limit?: 'all' | number
  offset: number
}

export type GetAllPainResponse = {
  data: Array<PainSingle>
  pagination: any
}

@Injectable()
export class PainDatabase extends CcrDatabase {
  constructor(/*private pain: PainTracking*/) {
    super()
  }

  fetchAll(args: GetAllPainRequest): Observable<GetAllPainResponse> {
    const regions = ['back', 'loin', 'shoulder']
    const types = ['General', 'Pounding', 'Throbbing', 'Stabbing']

    const data: Array<PainSingle> = []

    // generate from 3 to 8 records
    const num = getRandom(3, 8)
    for (let i = 0; i < num; i++) {
      // random dates/hours in the selected week
      const date = moment(args.startDate)
        .add({
          days: getRandom(0, 6)
        })
        .set({
          hours: getRandom(7, 19),
          minutes: getRandom(0, 59)
        })
      // random the region
      const region = regions[getRandom(0, 2)]
      // randomly including or not duration
      let duration
      if (getRandom(0, 1)) {
        duration = {
          hours: getRandom(0, 4),
          minutes: getRandom(0, 59)
        }
      }
      // random the intensity
      const intensity = getRandom(1, 5)
      // random the pain type
      const description = types[getRandom(0, 3)]

      // create and insert the record
      const record: PainSingle = {
        reportedAt: date.format(),
        region,
        duration,
        intensity,
        description
      }
      data.push(record)
    }

    // TODO remove this with npm-api update
    const response: GetAllPainResponse = { data, pagination: {} }
    const return$ = new BehaviorSubject<GetAllPainResponse>(response)
    setTimeout(() => {
      return$.complete()
    }, 500)
    return return$
  }
}

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
