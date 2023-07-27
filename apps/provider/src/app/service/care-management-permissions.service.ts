import { Injectable } from '@angular/core'
import { ContextService } from './context.service'
import {
  AccSingleResponse,
  AccountProvider,
  CareManagementState,
  OrganizationAccess,
  OrganizationProvider
} from '@coachcare/sdk'
import { flatMap, sortBy, uniqBy } from 'lodash'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { _ } from '@coachcare/backend/shared'
import moment from 'moment'

@Injectable({ providedIn: 'root' })
export class CareManagementPermissionsService {
  public activeCareEntries: RPMStateEntry[]
  permissions: OrganizationAccess[] = []
  restrictions: OrganizationAccess[] = []
  careEntries: RPMStateEntry[]
  mostRecentEntry: RPMStateEntry

  constructor(
    private context: ContextService,
    private organization: OrganizationProvider,
    private careManagementState: CareManagementState,
    private account: AccountProvider
  ) {}

  public async init(accountId: string) {
    const accessibleOrgs = (
      await this.organization.getAccessibleList({
        account: accountId,
        limit: 'all',
        offset: 0
      })
    ).data

    const accessibleCareServices =
      this.context.accessibleCareManagementServiceTypes.slice()

    const promises = flatMap(
      accessibleCareServices.map((careService) =>
        accessibleOrgs.map((org) =>
          this.careManagementState.getList({
            account: accountId,
            organization: org.organization.id,
            serviceType: careService.id,
            limit: 'all',
            offset: 0
          })
        )
      )
    )

    const responses = await Promise.all(promises)
    let allEntries = flatMap(responses.map((response) => [...response.data]))

    allEntries = uniqBy(allEntries, 'id')
    this.careEntries = allEntries
      .slice()
      .map((entry) => new RPMStateEntry({ rpmState: entry }))
    this.activeCareEntries = this.careEntries.filter((entry) => entry.isActive)
    this.mostRecentEntry = new RPMStateEntry({
      rpmState: sortBy(allEntries, (entry) => moment(entry.createdAt)).pop()
    })

    if (this.mostRecentEntry.rpmState.createdBy) {
      this.mostRecentEntry.rpmState.createdBy =
        await this.resolveCreatedByAccount(
          this.mostRecentEntry.rpmState.createdBy.id
        )
    }

    const permissionPromises = accessibleOrgs.map((org) =>
      this.resolveOrgPermissions(org)
    )
    const restrictionPromises = accessibleOrgs.map((org) =>
      this.resolveOrgPermissions(org, false)
    )

    this.permissions = (await Promise.all(permissionPromises)).filter(
      (org) => !!org
    )
    this.restrictions = (await Promise.all(restrictionPromises)).filter(
      (org) => !!org
    )
  }

  private async resolveCreatedByAccount(
    id: string
  ): Promise<AccSingleResponse> {
    try {
      return await this.account.getSingle(id)
    } catch (error) {
      return {
        id: '',
        accountType: undefined,
        firstName: _('BOARD.INACCESSIBLE_PROVIDER'),
        lastName: '',
        email: '',
        preferredLocales: [],
        preference: {},
        createdAt: '',
        isActive: true,
        measurementPreference: 'metric',
        timezone: '',
        phone: '',
        countryCode: '',
        phoneType: 'ios'
      }
    }
  }

  private async resolveOrgPermissions(
    organization,
    positivePermission: boolean = true
  ) {
    const hasAdminPermission = await this.context.orgHasPerm(
      organization.organization.id,
      'admin',
      false
    )

    if (hasAdminPermission) {
      if (positivePermission) {
        return organization
      } else {
        return undefined
      }
    } else if (positivePermission) {
      return undefined
    } else {
      return organization
    }
  }
}
