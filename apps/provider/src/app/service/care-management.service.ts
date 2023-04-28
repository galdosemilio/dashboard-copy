import { Injectable } from '@angular/core'
import { TrackableBillableCode } from '@app/shared/components/rpm-tracker/model'
import {
  FetchCareManagementBillingCodesRequest,
  FetchCareManagementBillingCodesResponse,
  Reports
} from '@coachcare/sdk'
import moment from 'moment'
import { from } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CareManagementService {
  public billingCodes: FetchCareManagementBillingCodesResponse['data'] = []
  public trackableCptCodes: Partial<TrackableBillableCode> = {}

  constructor(private reports: Reports) {
    from(
      this.fetchCareManagementBillingCodes({
        asOf: moment().format('YYYY-MM-DD')
      })
    ).subscribe((response: FetchCareManagementBillingCodesResponse) => {
      this.billingCodes = response.data
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
              maxEligibleAmount: code.type === 'addon' ? 2 : 1,
              requiresTimeTracking: true
            }
          }
        }

        return memo
      }, {})
    })
  }

  private fetchCareManagementBillingCodes(
    args: FetchCareManagementBillingCodesRequest
  ): Promise<FetchCareManagementBillingCodesResponse> {
    try {
      return this.reports.fetchCareManagementBillingCodes(args)
    } catch (error) {
      console.error(error)
    }
  }
}
