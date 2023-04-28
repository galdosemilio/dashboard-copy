import {
  AccountData,
  ExternalIdentifier,
  OrganizationWithoutShortcode,
  RPMStateSummaryBillingItem
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
import { RPM_DEVICES, RPMDevice } from './rpmDevices.map'
import { TrackableBillableCode } from '@app/shared/components/rpm-tracker/model'
import { cloneDeep, get, set } from 'lodash'
import {
  CareManagementSnapshotBillingItem,
  CareManagementStateSummaryItem,
  CareManagementStateSummaryItemState
} from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'

const MONITORING_PERIOD_SECONDS = 1200
const MAX_99458_MINUTES = 40

export type RPMMetricType =
  | 'transmissions'
  | 'monitoring'
  | 'liveInteraction'
  | 'relatedCodeRequirementsNotMet'

interface RPMStateSummaryBilling extends RPMStateSummaryBillingItem {
  hasClaims: boolean
  hasCodeRequirements: boolean
  remainingDays: number
}

export class RPMStateSummaryEntry implements CareManagementStateSummaryItem {
  account: AccountData & { timezone: string }
  anyCodeLastEligibleAt: string
  billing: RPMStateSummaryBilling[]
  changedAt: string
  id: string
  organization: OrganizationWithoutShortcode
  device: RPMDevice
  remainingDays: number
  state: CareManagementStateSummaryItemState
  externalIdentifiers: ExternalIdentifier[]

  constructor(
    args: any,
    allBillings: CareManagementSnapshotBillingItem[],
    trackableCodes: Record<string, TrackableBillableCode> = {},
    asOf?: string
  ) {
    this.account = args.account
    this.anyCodeLastEligibleAt = args.anyCodeLastEligibleAt
    this.billing = allBillings.map(
      (bill) => ({ code: bill.code, eligibility: {} } as any)
    )

    let additionalIndex = 0

    args.billing.forEach((billing) => {
      const allBillingsIndex = allBillings.findIndex(
        (bill) => bill.code === billing.code
      )
      const billingsIndex = allBillingsIndex + additionalIndex
      const trackableCode = trackableCodes[billing.code]

      if (trackableCode?.deps?.length) {
        set(billing, 'eligibility.next.deps', trackableCode.deps)
      }

      if (trackableCode?.maxEligibleAmount > 1) {
        for (
          let index = 0;
          index < trackableCode.maxEligibleAmount;
          index += 1
        ) {
          const copiedBill = cloneDeep(billing)
          const metStep = get(
            copiedBill,
            'eligibility.next.alreadyEligibleCount',
            0
          )

          if (index > 0) {
            set(copiedBill, 'eligibility.next.deps', [billing.code])
          }

          if (metStep > index) {
            const monitoringRequired =
              copiedBill.eligibility?.next?.monitoring?.total?.seconds?.required
            const liveInteractionRequired =
              copiedBill.eligibility?.next?.liveInteraction?.required

            if (monitoringRequired) {
              set(
                copiedBill,
                'eligibility.next.monitoring.total.seconds.tracked',
                monitoringRequired
              )
            }

            if (liveInteractionRequired) {
              set(
                copiedBill,
                'copiedBill.eligibility.next.liveInteraction.required',
                liveInteractionRequired
              )
            }

            set(
              copiedBill,
              'eligibility.next.relatedCodeRequirementsNotMet',
              []
            )
          }

          copiedBill.code = `${copiedBill.code} (${index + 1})`
          this.billing[billingsIndex + index] = {
            ...copiedBill,
            eligibility: {
              ...copiedBill.eligibility,
              next: this.calculateNextObject(copiedBill.eligibility.next)
            },
            remainingDays: copiedBill?.eligibility?.next?.earliestEligibleAt
              ? Math.abs(
                  moment(copiedBill.eligibility.next.earliestEligibleAt).diff(
                    moment(asOf).startOf('day'),
                    'days'
                  )
                )
              : 0
          }

          additionalIndex += 1
        }
      } else {
        this.billing[billingsIndex] = {
          ...billing,
          eligibility: {
            ...billing.eligibility,
            next: this.calculateNextObject(billing.eligibility.next)
          },
          remainingDays: billing?.eligibility?.next?.earliestEligibleAt
            ? Math.abs(
                moment(billing.eligibility.next.earliestEligibleAt).diff(
                  moment(asOf).startOf('day'),
                  'days'
                )
              )
            : 0
        }
      }

      this.billing.forEach((billingEntry) => {
        billingEntry.hasCodeRequirements =
          (billingEntry.eligibility.next?.relatedCodeRequirementsNotMet
            ?.length ?? 0) > 0
        billingEntry.hasClaims = billingEntry?.eligibility?.last?.count > 0
      })
    })

    this.changedAt = args.changedAt
    this.id = args.account.id
    this.organization = args.organization

    this.state = {
      ...args.state,
      deviceProvidedAtFormatted: args.state.deviceProvidedAt
        ? moment(args.state.deviceProvidedAt).format('MM/DD/YYYY')
        : 'No',
      educationProvidedAtFormatted: args.state.educationProvidedAt
        ? moment(args.state.educationProvidedAt).format('MM/DD/YYYY')
        : 'No'
    }
    this.externalIdentifiers = args.externalIdentifiers

    const devices = Object.values(RPM_DEVICES)

    if (!args.state.plan) {
      this.device = devices.find((device) => device.id === '-1')
      return
    }

    const foundPlanDevice = devices.find((device) =>
      args.state.plan ? device.id === args.state.plan.id : false
    )

    if (!foundPlanDevice) {
      this.device = {
        id: '-1',
        name: args.state.plan.name,
        displayName: args.state.plan.name
      }
      return
    }

    this.device = foundPlanDevice
  }

  private calculateNextObject(
    currentNext: RPMStateSummaryBillingItem['eligibility']['next']
  ): any {
    const parsedNext = {}

    if (!currentNext) {
      return
    }

    Object.keys(currentNext).forEach((key) => {
      if (typeof currentNext[key] !== 'object') {
        parsedNext[key] = currentNext[key]
      }

      parsedNext[key] = this.getRemainingMetric(
        currentNext[key],
        key as RPMMetricType
      )
    })

    return { ...parsedNext }
  }

  private getRemainingMetric(raw: any, type: RPMMetricType) {
    const returnValue = {
      before20: 0,
      after20: 0,
      remaining: 0,
      units: '',
      remainingRaw: 0,
      ...raw
    }

    switch (type) {
      case 'transmissions':
        return {
          ...raw,
          remaining:
            raw.distinctDates.count <= raw.distinctDates.required
              ? raw.distinctDates.required - raw.distinctDates.count
              : 0,
          transmissionsOf16: raw.distinctDates.count >= 16 ? 'Yes' : 'No'
        }

      case 'monitoring':
        if (
          raw.total.seconds.tracked === undefined ||
          raw.total.seconds.required === undefined
        ) {
          return {
            remaining: 0,
            before20: 0,
            after20: raw.total.seconds.elapsed
              ? Math.min(
                  Math.floor(raw.total.seconds.elapsed / 60),
                  MAX_99458_MINUTES
                )
              : 0
          }
        }

        returnValue.remaining =
          raw.total.seconds.tracked <= raw.total.seconds.required
            ? Math.ceil(
                (raw.total.seconds.required - raw.total.seconds.tracked) / 60
              )
            : 0

        returnValue.before20 = Math.floor(
          Math.min(raw.total.seconds.tracked, MONITORING_PERIOD_SECONDS) / 60
        )

        returnValue.after20 = Math.min(
          Math.floor(raw.total.seconds.elapsed / 60),
          MAX_99458_MINUTES
        )

        returnValue.units = _('UNIT.MINUTE_CONDENSED')
        break

      case 'liveInteraction':
        return {
          ...raw,
          remaining: raw.count <= raw.required ? raw.required - raw.count : 0,
          hasInteraction: raw.count >= 1 ? 'Yes' : 'No'
        }

      case 'relatedCodeRequirementsNotMet':
        return [...raw]

      default:
        return raw
    }

    return returnValue
  }
}
