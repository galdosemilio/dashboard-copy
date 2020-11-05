import { Component, OnDestroy, OnInit } from '@angular/core'
import { resolveConfig } from '@app/config/section'
import {
  EnrollmentReportsDataSource,
  ReportsCriteria,
  ReportsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { _, ChartData, ViewUtils } from '@app/shared'
import {
  EnrollmentSimpleReportResponse,
  TimelineUnit
} from '@coachcare/npm-api'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'

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
  csvSeparator = ','
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

    this.refresh$.subscribe(async () => {
      this.simpleReport = null
      try {
        this.resolveIdentifierNames()
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
      } catch (error) {
        this.simpleReport = null
        this.notifier.error(error)
      }
    })

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

  downloadDetailedCSV() {
    const startDate = moment(this.data.startDate).format('YYYY-MM-DD')
    const endDate = moment(this.data.endDate).format('YYYY-MM-DD')
    const headers = [
      'Account ID',
      'Account First Name',
      'Account Last Name',
      'Account Email',
      'Account External Identifiers',
      'Organization ID',
      'Organization Name',
      'Organization External Identifiers',
      'Package ID',
      'Package Name',
      'Package Enrollment Start',
      'Package Enrollment End'
    ]
    const filename = `enrollment_details_${startDate}_${endDate}.csv`

    let csv = ''
    csv += `DIETER PHASE ENROLLMENT: ${startDate} - ${endDate}` + '\r\n'
    csv += headers.join(this.csvSeparator) + '\r\n'
    const items = this.preprocessSimpleReportElements(this.simpleReport.data)

    csv += this.renderDetailedCSV(items)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('visibility', 'hidden')
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    csv += 'Enrollments' + this.csvSeparator
    csv +=
      dates.map((d) => moment(d).format('YYYY-MM-DD')).join(this.csvSeparator) +
      '\r\n'
    this.chart.datasets.forEach((d) => {
      csv += d.label
      d.data
        .filter((o) => o.x)
        .forEach((r) => {
          csv += this.csvSeparator + r.y
        })
      csv += '\r\n'
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('visibility', 'hidden')
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  private renderDetailedCSV(items: any[]): string {
    let csv = ''

    items.forEach((item) => {
      if (item.enrollments && item.enrollments.length) {
        const individualIdentifiers = item.externalIdentifiers.filter(
          (identifier) => identifier.isIndividual
        )
        const organizationIdentifiers = item.externalIdentifiers.filter(
          (identifier) => !identifier.isIndividual
        )

        csv +=
          `"${item.account.id}"` +
          this.csvSeparator +
          `"${item.account.firstName}"` +
          this.csvSeparator +
          `"${item.account.lastName}"` +
          this.csvSeparator +
          `"${item.account.email}"` +
          this.csvSeparator

        if (individualIdentifiers && individualIdentifiers.length) {
          csv += `"`
          individualIdentifiers.forEach((identifier, index) => {
            const displayName =
              this.identifierNames[identifier.name] || undefined
            csv += displayName
              ? `${displayName}: ${identifier.value}`
              : `${identifier.name}: ${identifier.value}`
            csv += `${index < individualIdentifiers.length - 1 ? '\n' : ''}`
          })
          csv += `"`
          csv += this.csvSeparator
        } else {
          csv += `" "${this.csvSeparator}`
        }

        csv += `"${item.organization.id}"` + this.csvSeparator
        csv += `"${item.organization.name}"` + this.csvSeparator

        if (organizationIdentifiers && organizationIdentifiers.length) {
          csv += `"`
          organizationIdentifiers.forEach((identifier, index) => {
            const displayName =
              this.identifierNames[identifier.name] || undefined
            csv += displayName
              ? `${displayName}: ${identifier.value}`
              : `${identifier.name}: ${identifier.value}`
            csv += `${index < organizationIdentifiers.length - 1 ? '\n' : ''}`
          })
          csv += `"`
          csv += this.csvSeparator
        } else {
          csv += `" "${this.csvSeparator}`
        }

        csv += `"`
        csv += item.enrollments.reduce((cell, enrollment, index) => {
          cell += enrollment.package ? `${enrollment.package.id}` : ''
          cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
          return cell
        }, '')
        csv += `"`
        csv += this.csvSeparator

        csv += `"`
        csv += item.enrollments.reduce((cell, enrollment, index) => {
          cell += enrollment.package ? `${enrollment.package.title}` : ''
          cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
          return cell
        }, '')
        csv += `"`
        csv += this.csvSeparator

        csv += `"`
        csv += item.enrollments.reduce((cell, enrollment, index) => {
          cell +=
            enrollment.range && enrollment.range.start
              ? `${enrollment.range.start}`
              : ''
          cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
          return cell
        }, '')
        csv += `"`
        csv += this.csvSeparator

        csv += `"`
        csv += item.enrollments.reduce((cell, enrollment, index) => {
          cell +=
            enrollment.range && enrollment.range.end
              ? `${enrollment.range.end}`
              : ''
          cell += `${index < item.enrollments.length - 1 ? '\n' : ''}`
          return cell
        }, '')
        csv += `"`
        csv += '\r\n'
      }
    })

    return csv
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
