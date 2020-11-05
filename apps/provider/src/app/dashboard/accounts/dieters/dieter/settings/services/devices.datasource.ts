import { Injectable } from '@angular/core'
import { NotifierService } from '@app/service'
import { _, TableDataSource } from '@app/shared'
import { AuthAvailableResponse, DeviceSyncResponse } from '@coachcare/npm-api'
import { find, orderBy } from 'lodash'
import { from, Observable } from 'rxjs'
import { DevicesDatabase } from './devices.database'

export interface AuthAvailableRequest {
  dieterId: string
}

@Injectable()
export class DevicesDataSource extends TableDataSource<
  any,
  any,
  AuthAvailableRequest
> {
  footnotes: Array<string>

  constructor(
    protected notify: NotifierService,
    protected database: DevicesDatabase
  ) {
    super()
  }

  defaultFetch(): any {
    return []
  }

  fetch(
    criteria: AuthAvailableRequest
  ): Observable<[AuthAvailableResponse, DeviceSyncResponse]> {
    return from(
      Promise.all([
        this.database.available(criteria.dieterId),
        this.database.lastActivity(criteria.dieterId)
      ])
    )
  }

  mapResult(result: [AuthAvailableResponse, DeviceSyncResponse]) {
    this.footnotes = []
    return orderBy(
      result[0].data.map((v) => {
        const device = this.mapService(v.service)
        const activity = find(result[1].data, ['title', device])
        return {
          title: this.serviceTitle(v.service),
          icon: v.service.toLowerCase(),
          connected: v.token ? true : false,
          lastSyncedAt: activity ? activity.lastSyncedAt : null
        }
      }),
      'title'
    )
  }

  private serviceTitle(service: string) {
    switch (service) {
      case 'fitbit': {
        this.footnotes.push(_('DEVICE.FITBIT.FOOTNOTE'))
        return _('DEVICE.FITBIT.TITLE')
      }
      case 'google': {
        this.footnotes.push(_('DEVICE.GOOGLEFIT.FOOTNOTE'))
        return _('DEVICE.GOOGLEFIT.TITLE')
      }
      case 'healthkit': {
        this.footnotes.push(_('DEVICE.HEALTHKIT.FOOTNOTE'))
        return _('DEVICE.HEALTHKIT.TITLE')
      }
      case 'levl': {
        return _('DEVICE.LEVL.TITLE')
      }
    }
    return service
  }

  private mapService(title: string) {
    const services = {
      fitbit: 'Fitbit',
      google: 'GoogleFit',
      healthkit: 'HealthKit',
      levl: 'Levl'
    }
    return services[title] ? services[title] : title
  }
}
