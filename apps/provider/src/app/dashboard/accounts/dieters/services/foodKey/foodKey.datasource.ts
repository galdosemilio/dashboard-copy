import { find } from 'lodash'
import * as moment from 'moment-timezone'
import { from, Observable, of } from 'rxjs'

import { NotifierService } from '@app/service'
import { _, TableDataSource } from '@app/shared'
import {
  ConsumedKeyResponse,
  FetchAllConsumedKeyRequest,
  FetchAllConsumedKeyResponse,
  FetchAllOrganizationKeyRequest,
  FetchAllOrganizationKeyResponse
} from '@coachcare/npm-api'

import {
  FoodKeyData,
  FoodKeySegment
} from '@app/dashboard/accounts/dieters/models/foodKey/foodKey.interface'
import { FoodKeyDatabase } from './foodKey.database'

export type FoodKeyCollection = [
  FetchAllOrganizationKeyResponse[],
  FetchAllConsumedKeyResponse
]

export type FoodKeyCriteria = FetchAllConsumedKeyRequest & { unit: string }

export class FoodKeyDataSource extends TableDataSource<
  FoodKeySegment,
  FoodKeyCollection,
  FoodKeyCriteria
> {
  public columns = []

  constructor(
    protected notify: NotifierService,
    protected database: FoodKeyDatabase
  ) {
    super()
  }

  preQuery() {
    super.preQuery()
    this.columns = []
  }

  defaultFetch(): FoodKeyCollection {
    return [
      [],
      {
        data: [],
        pagination: {}
      }
    ]
  }

  fetch(criteria: FetchAllConsumedKeyRequest): Observable<FoodKeyCollection> {
    const keysRequest: FetchAllOrganizationKeyRequest = {
      organization: criteria.organization,
      isActive: true
    }
    return criteria.organization
      ? from(
          Promise.all([
            this.database.orgKeys(keysRequest),
            this.database.fetchAll(criteria)
          ])
        )
      : of(this.defaultFetch())
  }

  mapResult(results: FoodKeyCollection): FoodKeySegment[] {
    const consumedHistory: FoodKeySegment[] = []

    const end = moment.utc(this.criteria.endDate)
    const date = moment.utc(this.criteria.startDate)
    while (date.isSameOrBefore(end)) {
      const row = { date: date.format('MMMM D') } as FoodKeySegment
      results[0].forEach(
        (orgKey) =>
          (row[orgKey.key.id] = {
            key: orgKey.key.id,
            name: orgKey.key.name,
            quantity: 0
          })
      )
      consumedHistory.push(row)
      date.add(1, this.criteria.unit as moment.unitOfTime.DurationConstructor)
    }

    results[1].data.forEach((resultData: ConsumedKeyResponse) => {
      const register = find(consumedHistory, {
        date: moment.utc(resultData.consumedAt).format('MMMM D')
      })

      if (register[resultData.key.id]) {
        register[resultData.key.id].quantity += resultData.quantity
      } else {
        register[resultData.key.id] = {
          key: resultData.key.id,
          quantity: resultData.quantity,
          name: resultData.key.name
        }
      }
    })

    this.setColumns(consumedHistory)

    return consumedHistory
  }

  getKeyName(keyId: string) {
    return this._result[0][keyId].name || _('GLOBAL.DATE')
  }

  private setColumns(consumedHistory: FoodKeySegment[]) {
    this.columns = []
    for (const prop in consumedHistory[0]) {
      if (consumedHistory[0].hasOwnProperty(prop)) {
        if (prop !== 'date') {
          this.columns.push(prop)
        } else {
          this.columns.splice(0, 0, prop)
        }
      }
    }
  }
}
