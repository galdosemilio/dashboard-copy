import { Injectable } from '@angular/core'
import * as moment from 'moment'
import { Exercise, FoodKey } from '@coachcare/npm-api'
import {
  MetricsDataSourceCriteria,
  MetricsDataSourceResponse
} from './metrics.datasource'

@Injectable()
export class MetricsDatabase {
  constructor(private exercise: Exercise, private foodKey: FoodKey) {}

  public async fetch(
    args: MetricsDataSourceCriteria
  ): Promise<MetricsDataSourceResponse> {
    try {
      const orgKeys = await this.foodKey.fetchAllOrganizationKeys({
        organization: args.organization
      })

      let keys

      keys = orgKeys.length
        ? await this.foodKey.fetchAllConsumed({
            organization: args.organization,
            account: args.account,
            limit: 'all',
            startDate: args.startDate,
            endDate: args.endDate,
            key: orgKeys[0].key.id
          })
        : { data: [], pagination: {} }

      const exercise = await this.exercise.getAll({
        account: args.account,
        start: moment(args.startDate).startOf('day').toISOString(),
        end: moment(args.endDate).endOf('day').toISOString(),
        limit: 'all'
      })

      return { keys, exercise }
    } catch (error) {
      return Promise.reject('Error while fetching keys and exercises')
    }
  }
}
