import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { findIndex } from 'lodash'
import { Subject } from 'rxjs'
import * as moment from 'moment-timezone'

import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { SelectOption, _ } from '@app/shared/utils'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { AlertsDatabase, AlertsDataSource } from './services'
import { debounceTime } from 'rxjs/operators'
import { NotificationRequest, PackageOrganization } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { LocalStorageService } from '@app/service/local-storage'
import { ALERTS_FILTERS } from '@coachcare/common/services'

@UntilDestroy()
@Component({
  selector: 'app-reports-alerts',
  templateUrl: './alerts.component.html',
  providers: [AlertsDataSource]
})
export class AlertsComponent implements OnInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  source: AlertsDataSource

  alert: string
  alerts = [
    { viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined },
    { viewValue: _('REPORTS.TYPE_MEASUREMENTS'), value: '1' },
    { viewValue: _('REPORTS.TYPE_INACTIVITY'), value: 2 },
    { viewValue: _('REPORTS.TYPE_WEIGHT_THRESHOLD'), value: '5' },
    { viewValue: _('ALERTS.TYPES.DATA_THRESHOLD_ALERT'), value: '6' },
    { viewValue: _('ALERTS.TYPES.MISSING_DATA_ALERT'), value: '7' }
  ]

  rpmStatus: 'active' | 'inactive'
  rpmStatusList = [
    { viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined },
    {
      viewValue: _('REPORTS.PATIENTS_CURRENTLY_ENROLLED_IN_RPM'),
      value: 'active'
    },
    {
      viewValue: _('REPORTS.PATIENTS_NOT_CURRENTLY_ENROLLED_IN_RPM'),
      value: 'inactive'
    }
  ]

  package: number
  packages: SelectOption<number>[] = []

  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020577952-Viewing-Notifications-in-the-Dashboard'

  constructor(
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: AlertsDatabase,
    private packageOrganization: PackageOrganization,
    private localStorage: LocalStorageService
  ) {}

  // refresh chart trigger
  refresh$ = new Subject<boolean>()

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')

    this.source = new AlertsDataSource(
      this.notifier,
      this.database,
      this.context,
      this.translator
    )
    // setup the table source
    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id,
      viewed: false
    }))
    this.source.addOptional(this.refresh$.pipe(debounceTime(300)), () => {
      const k = findIndex(this.alerts, { value: this.alert })

      const query: Partial<NotificationRequest> =
        k === 0
          ? {}
          : typeof this.alert === 'string'
          ? { type: this.alert }
          : { category: this.alert }

      if (this.rpmStatus) {
        query.rpm = this.rpmStatus
      }

      if (this.package) {
        query.package = this.package
      }

      return query
    })
    this.source.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id
    }))
    this.source.addOptional(
      this.paginator.page,
      this.calculatePagination.bind(this)
    )

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((org) => this.resolvePackages(org))

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        if (data.length === 0 && this.paginator.pageIndex > 0) {
          this.paginator.pageIndex = 0
          this.refresh()
        }
      })
  }

  private async resolvePackages(org: SelectedOrganization) {
    this.getFiltersFromLocalStorage(org)
    this.refresh()
    this.packages = [{ viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined }]

    try {
      const res = await this.packageOrganization.getAll({
        organization: org.id,
        isActive: true,
        limit: 'all'
      })

      this.packages = [
        ...this.packages,
        ...res.data.map((entry) => ({
          viewValue: entry.package.title,
          value: Number(entry.package.id)
        }))
      ]
      if (
        this.package &&
        !this.packages.some((p) => p.value === this.package)
      ) {
        this.package = null
        this.refresh()
      }
    } catch (err) {
      this.notifier.error(err)
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  refresh() {
    this.saveFiltersToLocalStorage()
    this.paginator.pageIndex = 0
    this.refresh$.next(true)
  }

  private calculatePagination() {
    const filters = this.localStorage.get(
      `${ALERTS_FILTERS}_${this.context.organizationId}`
    )

    if (this.paginator.pageIndex > 0) {
      this.saveFiltersToLocalStorage()
    }

    if (filters?.offset != 0 && this.paginator.pageIndex == 0) {
      this.paginator.pageIndex = filters?.offset ?? 0
    }

    return {
      limit: this.paginator.pageSize || 12,
      offset: this.paginator.pageIndex * (this.paginator.pageSize || 12)
    }
  }

  private saveFiltersToLocalStorage() {
    const filters: {
      package: number
      rpmStatus: 'active' | 'inactive'
      alert: string
      offset?: number
    } = {
      package: this.package,
      rpmStatus: this.rpmStatus,
      alert: this.alert
    }

    if (this.paginator.pageIndex !== 0) {
      filters.offset = this.paginator.pageIndex
    }

    this.localStorage.setWithExpiry(
      `${ALERTS_FILTERS}_${this.context.organizationId}`,
      filters,
      moment.duration(1, 'month')
    )
  }

  private getFiltersFromLocalStorage(org?: SelectedOrganization) {
    const filters = this.localStorage.get(
      `${ALERTS_FILTERS}_${org?.id ?? this.context.organizationId}`
    )

    if (filters) {
      this.alert = filters.alert
      this.rpmStatus = filters.rpmStatus
      this.package = filters.package
      this.paginator.pageIndex = filters.offset ?? 0
    } else {
      this.alert = undefined
      this.package = null
      this.rpmStatus = undefined
      this.paginator.pageIndex = 0
    }
  }
}
