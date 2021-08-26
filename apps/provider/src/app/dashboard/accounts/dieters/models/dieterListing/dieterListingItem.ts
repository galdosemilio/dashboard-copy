import { ExpandableTableItem } from '@app/shared'
import { MeasurementDataPointSingle } from '@coachcare/sdk'
import * as moment from 'moment'
import { DieterListingOrgItem } from './dieterListingOrgItem'
import { DieterListingPackageItem } from './dieterListingPackageItem'

export class DieterListingItem implements ExpandableTableItem {
  dataPoints: MeasurementDataPointSingle[]
  email: string
  id: string
  isEmpty: boolean
  isExpanded: boolean
  isHidden: boolean
  isLastOfGroup: boolean
  firstName: string
  lastName: string
  phone: string
  level: number
  organizations: DieterListingOrgItem[]
  orgCount: number
  packageCount: number
  packages: DieterListingPackageItem[]
  startedAt: string
  totalDays?: number
  weight?: {
    start?: { value: number; date: string }
    change?: { value: number; percent: number }
    end?: { value: number; date: string }
  }

  constructor(args: any) {
    this.dataPoints = args.dataPoints ?? null
    this.id = args.id || ''
    this.email = args.email || ''
    this.firstName = args.firstName || ''
    this.isEmpty = args.isEmpty || false
    this.isExpanded = args.isExpanded || false
    this.isHidden = args.isHidden || false
    this.lastName = args.lastName || ''
    this.phone = args.phone || ''
    this.level = args.level || 0
    this.organizations =
      args.organizations && args.organizations.length
        ? args.organizations.map((org) => new DieterListingOrgItem(org))
        : []
    this.orgCount = args.orgCount || 0
    this.packageCount = args.packageCount || 0
    this.packages =
      args.packages && args.packages.length
        ? args.packages.map((pkg) => new DieterListingPackageItem(pkg))
        : []
    this.startedAt = args.startedAt || ''

    if (args.weight) {
      this.weight = {} as any

      if (args.weight.first) {
        this.weight.start = {
          value: args.weight.first.value,
          date: args.weight.first.recordedAt.utc
        }
      }

      if (args.weight.last) {
        this.weight.end = {
          value: args.weight.last.value,
          date: args.weight.last.recordedAt.utc
        }
      }

      if (args.weight.change) {
        this.weight.change = {} as any
        this.weight.change.value = args.weight.change.value
        this.weight.change.percent = args.weight.change.percentage
      }
    }

    if (this.startedAt) {
      this.totalDays = Math.abs(
        moment(this.startedAt.split('T')[0]).diff(moment(), 'days')
      )
    }
  }
}
