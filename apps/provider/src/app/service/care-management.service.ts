import { Injectable } from '@angular/core'
import { TrackableBillableCode } from '@app/shared/components/rpm-tracker/model'
import { NotifierService } from '@coachcare/common/services'
import {
  BillingCode,
  CareManagementProvider,
  CareManagementServiceType,
  FetchCareManagementBillingCodesRequest,
  Reports
} from '@coachcare/sdk'
import moment from 'moment'

export interface CareServiceType {
  serviceType: CareManagementServiceType
  conflicts?: string[] // tags of conflicting care services
  deviceSetup?: boolean
}

enum ServiceTypeId {
  RPM = '1',
  CCM = '2',
  RTM = '3',
  PCM = '4',
  BHI = '5'
}

const serviceTypeConflictsMap: Record<string, string[]> = {
  [ServiceTypeId.RPM]: [ServiceTypeId.RTM],
  [ServiceTypeId.CCM]: [ServiceTypeId.PCM],
  [ServiceTypeId.RTM]: [ServiceTypeId.RPM],
  [ServiceTypeId.PCM]: [ServiceTypeId.CCM]
}

@Injectable({
  providedIn: 'root'
})
export class CareManagementService {
  public billingCodes: BillingCode[] = []
  public trackableCptCodes: Partial<TrackableBillableCode> = {}
  public serviceTypes: CareManagementServiceType[] = []
  public serviceTypeMap: Record<string, CareServiceType> = {}

  constructor(
    private reports: Reports,
    private careManagement: CareManagementProvider,
    private notify: NotifierService
  ) {
    void this.resolveData()
  }

  private async resolveData(): Promise<void> {
    this.billingCodes = await this.fetchCareManagementBillingCodes({
      asOf: moment().format('YYYY-MM-DD')
    })

    this.trackableCptCodes = this.billingCodes.reduce((memo, code) => {
      if (code.coverage !== 'monitoring') {
        return memo
      }

      const deps = Object.keys(memo[code.serviceType.id] ?? {}) ?? []

      memo[code.serviceType.id] = {
        ...memo[code.serviceType.id],
        ...{
          [code.value]: {
            code: code.value,
            deps,
            maxEligibleAmount: code.requirements?.maxIterations ?? 1,
            requiresTimeTracking: true
          }
        }
      }

      return memo
    }, {})

    this.serviceTypes = await this.fetchCareManagementServiceTypes()

    for (const serviceType of this.serviceTypes) {
      const deviceSetupEducationCode = this.billingCodes.find(
        (code) =>
          code.serviceType.id === serviceType.id &&
          code.coverage === 'device-setup-education'
      )
      this.serviceTypeMap[serviceType.id] = {
        serviceType,
        deviceSetup: deviceSetupEducationCode ? true : false,
        conflicts: serviceTypeConflictsMap[serviceType.id] ?? []
      }
    }
  }

  private async fetchCareManagementServiceTypes(): Promise<
    Array<CareManagementServiceType>
  > {
    try {
      const res = await this.careManagement.getServiceTypes()

      return res.data
    } catch (err) {
      this.notify.error(err)

      return []
    }
  }

  private async fetchCareManagementBillingCodes(
    args: FetchCareManagementBillingCodesRequest
  ): Promise<Array<BillingCode>> {
    try {
      const res = await this.reports.fetchCareManagementBillingCodes(args)

      return res.data.filter(
        (entry) => entry.coverage !== 'measurement-data-transmissions'
      )
    } catch (err) {
      this.notify.error(err)

      return []
    }
  }

  isAllowedTomorrow(serviceType: string) {
    switch (serviceType) {
      case ServiceTypeId.RPM:
      case ServiceTypeId.RTM:
        return true
      default:
        return false
    }
  }
}
