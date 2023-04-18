import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import {
  CareManagementFeaturePref,
  NotifierService
} from '@coachcare/common/services'
import {
  CareManagementPreference,
  CareManagementProvider
} from '@coachcare/sdk'

@Injectable()
export class CareManagementPreferencesResolver
  implements Resolve<CareManagementFeaturePref[]>
{
  constructor(
    private careManagementProvider: CareManagementProvider,
    private carePreference: CareManagementPreference,
    private notifier: NotifierService
  ) {}

  async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<CareManagementFeaturePref[]> {
    try {
      const id = route.paramMap.get('id') as string

      const serviceTypesResponse =
        await this.careManagementProvider.getServiceTypes()
      const serviceTypes = serviceTypesResponse.data
      const preferencesResponse =
        await this.carePreference.getAllCareManagementPreferences({
          organization: id
        })

      const preferences = serviceTypes.map((serviceType) => ({
        serviceType,
        preference: preferencesResponse.data.find(
          (entry) => entry.serviceType.id === serviceType.id
        )
      }))

      return preferences
    } catch (error) {
      this.notifier.error(error)
      return []
    }
  }
}
