import { Component, OnDestroy, OnInit } from '@angular/core'
import { resolveConfig } from '@app/config/section'
import {
  EnrollmentReportsDataSource,
  ReportsCriteria,
  ReportsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { ChartData, ViewUtils } from '@app/shared'
import { EnrollmentSimpleReportResponse, TimelineUnit } from '@coachcare/sdk'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty, merge } from 'lodash'
import * as moment from 'moment-timezone'
import Papa from 'papaparse'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { CSV } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'app-reports-enrollment-chart',
  templateUrl: './enrollment-chart.component.html',
  styleUrls: ['./enrollment-chart.component.scss'],
  host: { class: 'ccr-chart' }
})
export class EnrollmentChartComponent implements OnInit, OnDestroy {
  simpleReport: EnrollmentSimpleReportResponse
  source: EnrollmentReportsDataSource
  chart: ChartData
  identifierNames: any = {}

  // subscription for selector changes
  data: ReportsCriteria
  timeout: any

  // refresh trigger
  private refresh$ = new Subject<void>()

  constructor(
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private database: ReportsDatabase,
    private viewUtils: ViewUtils,
    private translate: TranslateService,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new EnrollmentReportsDataSource(
      this.notifier,
      this.database,
      this.config,
      this.viewUtils
    )

    this.source.addRequired(this.refresh$, () => {
      let unit: TimelineUnit
      switch (true) {
        case this.data.diff > 30 * 6:
          // ~60 bars
          unit = 'month'
          break
        case this.data.diff > 7 * 5:
          // +-62 bars
          unit = 'week'
          break
        default:
          // < 62 bars
          unit = 'day'
      }

      return {
        organization: this.data ? this.data.organization : null,
        startDate: this.data
          ? moment(this.data.startDate).format('YYYY-MM-DD')
          : null,
        endDate: this.data
          ? moment(this.data.endDate).format('YYYY-MM-DD')
          : null,
        unit
      }
    })

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.refresh(chart)
      })

    this.refresh$.subscribe(() => this.resolveIdentifierNames())

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.refresh$.next()
        }
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      if (
        this.data &&
        this.source.isLoaded &&
        !this.source.isLoading &&
        org.id
      ) {
        this.refresh(this.source.cdata)
      }
    })

    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.resolveIdentifierNames())
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  refresh(data: ChartData) {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.chart = undefined // force refresh on change
    this.timeout = setTimeout(() => {
      this.chart = {}
      merge(this.chart, this.config.get('chart').factory('bar'), data)
    }, 500)
  }

  async downloadDetailedCSV(): Promise<void> {
    try {
      this.simpleReport = await this.database.fetchSimpleEnrollmentReport({
        organization: this.data ? this.data.organization : null,
        range: {
          start: this.data ? moment(this.data.startDate).toISOString() : null,
          end: this.data
            ? moment(this.data.endDate).add(1, 'day').toISOString()
            : null
        },
        enrollmentLimit: 'all',
        limit: 'all'
      })

      const startDate = moment(this.data.startDate).format('YYYY-MM-DD')
      const endDate = moment(this.data.endDate).format('YYYY-MM-DD')

      const filename = `enrollment_details_${startDate}_${endDate}.csv`

      let csv = `DIETER PHASE ENROLLMENT: ${startDate} - ${endDate}` + '\r\n'
      const items = this.preprocessSimpleReportElements(this.simpleReport.data)

      const data = this.getDetailedCSV(items)

      csv += Papa.unparse(data)

      CSV.toFile({ content: csv, filename })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  downloadCSV() {
    const dates = this.chart.datasets[0].data.filter((d) => d.x).map((d) => d.x)
    const startDate = moment(this.data.startDate).format('YYYY-MM-DD')
    const endDate = moment(this.data.endDate).format('YYYY-MM-DD')
    const orgName = this.chart.datasets[0].data[dates.length - 1].org
    const filename = `${orgName}_enrollments_${startDate}_${endDate}.csv`

    let csv = ''
    csv += 'DIETER PHASE ENROLLMENT\r\n'
    csv += `${orgName}: ${startDate} - ${endDate}` + '\r\n'

    const data = this.chart.datasets.map((dataset) => ({
      Enrollments: dataset.label,
      ...dataset.data.reduce(
        (prev, current) => ({
          ...prev,
          [current.x]: [current.y]
        }),
        {}
      )
    }))

    csv += Papa.unparse(data)

    CSV.toFile({ content: csv, filename })
  }

  private preprocessSimpleReportElements(array: any[]): any[] {
    const items = [],
      renderableItems = []

    array.forEach((data) => {
      const existingIndex = items.findIndex(
        (element) => element.account.id === data.account.id
      )
      const existing = existingIndex > -1 ? items[existingIndex] : undefined

      const existsWithOrganization =
        existing &&
        items.find(
          (it) =>
            it.account.id === data.account.id &&
            it.organization.id === data.organization.id &&
            it.enrollments.find(
              (enrollment) =>
                enrollment.package.id === data.enrollment.package.id
            )
        )

      if (!existsWithOrganization) {
        items.push({
          ...data,
          externalIdentifiers: data.externalIdentifier
            ? [data.externalIdentifier]
            : [],
          enrollments: data.enrollment ? [data.enrollment] : []
        })
      }

      if (existing) {
        const groupedExternalIdentifiers =
          data.externalIdentifier && existsWithOrganization
            ? [data.externalIdentifier]
            : []

        const existingElements = []

        items.forEach((item) => {
          if (item.account.id === existing.account.id) {
            existingElements.push(item)
          }
        })

        existingElements.forEach((element) => {
          if (
            element.externalIdentifiers &&
            element.externalIdentifiers.length
          ) {
            groupedExternalIdentifiers.push(
              ...element.externalIdentifiers.filter(
                (externalIdentifier) =>
                  !groupedExternalIdentifiers.find(
                    (id) => externalIdentifier.id === id.id
                  )
              )
            )
          }
        })

        existingElements.forEach(
          (element) =>
            (element.externalIdentifiers = groupedExternalIdentifiers)
        )
      }
    })

    items.forEach((item) => {
      if (item.enrollments && item.enrollments.length) {
        item.enrollments.forEach((enrollmentItem) => {
          renderableItems.push({ ...item, enrollments: [enrollmentItem] })
        })
      } else {
        renderableItems.push(item)
      }
    })

    return renderableItems
  }

  private getDetailedCSV(items: any[]): any {
    return items
      .filter((item) => item.enrollments && item.enrollments.length > 0)
      .map((item) => {
        const individualIdentifiers = item.externalIdentifiers.filter(
          (identifier) => identifier.isIndividual
        )
        const organizationIdentifiers = item.externalIdentifiers.filter(
          (identifier) => !identifier.isIndividual
        )

        let individualIdentifiersText = ''
        if (individualIdentifiers && individualIdentifiers.length) {
          individualIdentifiers.forEach((identifier, index) => {
            const displayName =
              this.identifierNames[identifier.name] || undefined
            individualIdentifiersText += displayName
              ? `${displayName}: ${identifier.value}`
              : `${identifier.name}: ${identifier.value}`
            individualIdentifiersText += `${
              index < individualIdentifiers.length - 1 ? '\n' : ''
            }`
          })
        }

        let organizationIdentifiersText = ''
        if (organizationIdentifiers && organizationIdentifiers.length) {
          organizationIdentifiers.forEach((identifier, index) => {
            const displayName =
              this.identifierNames[identifier.name] || undefined
            organizationIdentifiersText += displayName
              ? `${displayName}: ${identifier.value}`
              : `${identifier.name}: ${identifier.value}`
            organizationIdentifiersText += `${
              index < organizationIdentifiers.length - 1 ? '\n' : ''
            }`
          })
        }

        const row = {
          'Account ID': item.account.id,
          'Account First Name': item.account.firstName,
          'Account Last Name': item.account.lastName,
          'Account Email': item.account.email,
          'Account External Identifiers': individualIdentifiersText,
          'Organization ID': item.organization.id,
          'Organization Name': item.organization.name,
          'Organization External Identifiers': organizationIdentifiersText,
          'Package ID': item.enrollments.reduce((cell, enrollment, index) => {
            cell += enrollment.package ? `${enrollment.package.id}` : ''
            cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
            return cell
          }, ''),
          'Package Name': item.enrollments.reduce((cell, enrollment, index) => {
            cell += enrollment.package ? `${enrollment.package.title}` : ''
            cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
            return cell
          }, ''),
          'Package Enrollment Start': item.enrollments.reduce(
            (cell, enrollment, index) => {
              cell +=
                enrollment.range && enrollment.range.start
                  ? `${enrollment.range.start}`
                  : ''
              cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
              return cell
            },
            ''
          ),
          'Package Enrollment End': item.enrollments.reduce(
            (cell, enrollment, index) => {
              cell +=
                enrollment.range && enrollment.range.end
                  ? `${enrollment.range.end}`
                  : ''
              cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
              return cell
            },
            ''
          )
        }

        return row
      })
  }

  private resolveIdentifierNames() {
    const resolvedConfig = resolveConfig(
      'PATIENT_FORM.ACCOUNT_IDENTIFIERS_INPUT',
      this.context.organization
    )
    if (
      resolvedConfig &&
      resolvedConfig.values &&
      resolvedConfig.values.identifiers &&
      resolvedConfig.values.identifiers.length
    ) {
      this.translate
        .get(
          resolvedConfig.values.identifiers.reduce(
            (names, currentIdentifier) => {
              names.push(currentIdentifier.displayName)
              return names
            },
            []
          )
        )
        .subscribe((translations) => {
          resolvedConfig.values.identifiers.forEach((identifier) => {
            this.identifierNames[identifier.name] = translations[
              identifier.displayName
            ]
              ? translations[identifier.displayName]
              : undefined
          })
        })
    } else {
      this.identifierNames = {}
    }
  }
}
