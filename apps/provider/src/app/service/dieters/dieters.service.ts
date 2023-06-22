import { Injectable } from '@angular/core'
import * as moment from 'moment-timezone'
import { PatientsFilters } from './dieters.criteria'
import { STORAGE_PATIENTS_FILTERS } from '@app/config'
import { ContextService } from '@coachcare/common/services'

@Injectable()
export class DietersService {
  constructor(private context: ContextService) {}

  storeFilters(data: PatientsFilters): void {
    const rawPagination = window.localStorage.getItem(STORAGE_PATIENTS_FILTERS)

    const originalFilters = rawPagination ? JSON.parse(rawPagination) : {}
    const filters =
      originalFilters.organization === data.organization
        ? {
            ...originalFilters,
            ...data
          }
        : data
    window.localStorage.setItem(
      STORAGE_PATIENTS_FILTERS,
      JSON.stringify({
        ...filters,
        expires: moment.utc().add(2, 'days').toISOString()
      })
    )
  }

  recoverFilters(): PatientsFilters {
    const rawFilters = window.localStorage.getItem(STORAGE_PATIENTS_FILTERS)

    if (!rawFilters) {
      return
    }

    const filters: PatientsFilters = JSON.parse(rawFilters)

    if (
      filters.organization !== this.context.organizationId ||
      moment.utc().isAfter(moment.utc(filters.expires))
    ) {
      window.localStorage.removeItem(STORAGE_PATIENTS_FILTERS)

      return
    }

    return filters
  }
}
