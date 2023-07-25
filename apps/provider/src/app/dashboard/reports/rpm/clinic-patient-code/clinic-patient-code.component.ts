import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import {
  BillingCode,
  CareManagementServiceType,
  FetchCareManagementBillingSnapshotRequest
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { ReportsDatabase } from '../../services'
import { _ } from '@app/shared/utils'
import { environment } from 'apps/provider/src/environments/environment'
import * as moment from 'moment'
import { flatten, orderBy, uniq, uniqBy } from 'lodash'
import {
  CareManagementSnapshotBillingItem,
  FetchCareManagementBillingSnapshotResponse
} from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'
import { ClinicPatientCodeDataSource } from '../../services/clinic-patient-code-report.datasource'
import { Subject, debounceTime } from 'rxjs'
import { NotifierService } from '@app/service'
import { CSV } from '@coachcare/common/shared'
import { ContextService } from '@coachcare/common/services'
import { Sort } from '@angular/material/sort'
import { FormBuilder, FormGroup } from '@angular/forms'

type SatisfiedCount = number | SatisfiedCount99457 | SatisfiedCount99458

interface SatisfiedCount99457 {
  liveInteraction: number
  monitoringTime: number
  total: number
}

interface SatisfiedCount99458 {
  iteration1: number
  iteration2: number
}

interface ClinicPatientCodeReportCode {
  serviceType: string
  cptCode: string
  satisfiedCount: SatisfiedCount
}

interface ClinicPatientCodeReport {
  uniqueRPMEpisodesOfCare: number
  organization: { id: string; name: string }
  patientsUniqueCount: number
  codes: ClinicPatientCodeReportCode[]
}

interface PatientCodeRecord {
  organizationId: string
  cptCode: string
  willBeEligibleThisMonth: SatisfiedCount
}

type CsvRow = Record<
  string,
  {
    organization: { id: string; name: string }
    patientsUniqueCount: number
    codes: Record<
      number,
      {
        uniqueRPMEpisodesOfCare: number
        codes: Record<string, SatisfiedCount[]>
      }
    >
  }
>

@UntilDestroy()
@Component({
  selector: 'app-reports-rpm-clinic-patient-code',
  templateUrl: './clinic-patient-code.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ClinicPatientCodeComponent implements OnInit {
  public form: FormGroup
  public criteria: Partial<FetchCareManagementBillingSnapshotRequest> = {
    organization: environment.coachcareOrgId
  }
  public source: ClinicPatientCodeDataSource

  constructor(
    private context: ContextService,
    private builder: FormBuilder,
    private database: ReportsDatabase,
    private notifier: NotifierService
  ) {}

  public csvSeparator = ','
  public tableData: ClinicPatientCodeReport[]
  public reportData: ClinicPatientCodeReport[]
  public headings: string[] = []
  public serviceType: string
  public billingCodes: BillingCode[] = []
  public isLoading: boolean = false
  public asOfMax = moment().endOf('day')
  private rows: FetchCareManagementBillingSnapshotResponse['data'] = []
  private refresh$: Subject<void> = new Subject()
  private startOfThisMonth = moment()
    .startOf('month')
    .tz(this.context.user.timezone)
    .toISOString()
  private startOfNextMonth = moment()
    .add(1, 'month')
    .startOf('month')
    .tz(this.context.user.timezone)
    .toISOString()

  public ngOnInit(): void {
    this.form = this.builder.group({
      asOf: [moment()],
      serviceType: [null]
    })

    this.source = new ClinicPatientCodeDataSource(this.database, this.notifier)
    this.source.addDefault({ status: 'active', limit: 'all', offset: 0 })
    this.source.addRequired(
      this.form.valueChanges.pipe(debounceTime(500)),
      () => ({
        asOf: this.form.value.asOf.format('YYYY-MM-DD'),
        serviceType: this.form.value.serviceType || undefined,
        organization: environment.coachcareOrgId
      })
    )
    this.form.controls.asOf.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(() => {
        this.startOfNextMonth = this.form.value.asOf
          .clone()
          .add(1, 'month')
          .startOf('month')
          .tz(this.context.user.timezone)
          .toISOString()
        this.startOfThisMonth = this.form.value.asOf
          .clone()
          .startOf('month')
          .tz(this.context.user.timezone)
          .toISOString()

        void this.refreshDataWithBillingCodesChange()
      })

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.rows = data
        this.refresh$.next()
      })

    this.refresh$.pipe(untilDestroyed(this)).subscribe(() => {
      this.headings = this.setHeadings(this.serviceType)
      this.tableData = this.refreshData(this.serviceType, this.rows)
    })
  }

  private async resolveBillingCodes() {
    const asOf = this.form.value.asOf ?? moment()
    const billingCodesResponse =
      await this.database.fetchCareManagementBillingCodes({
        asOf: asOf.format('YYYY-MM-DD')
      })

    this.billingCodes = billingCodesResponse.data
    this.refresh$.next()
  }

  public async onServiceTypeChange(serviceType: string): Promise<void> {
    this.serviceType = serviceType
    this.form.patchValue({
      serviceType
    })
  }

  public sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.tableData = this.refreshData(this.serviceType, this.rows)
      return
    }

    this.tableData = orderBy(
      this.refreshData(this.serviceType, this.rows),
      (item) => {
        switch (sort.active) {
          case 'id':
            return item.organization.id
          case 'name':
            return item.organization.name
          default:
            return item.uniqueRPMEpisodesOfCare
        }
      },
      [sort.direction]
    )
  }

  private async refreshDataWithBillingCodesChange() {
    try {
      await this.resolveBillingCodes()
      this.refreshData(this.serviceType, this.rows)
    } catch (err) {
      this.notifier.error(err)
    }
  }

  public async downloadCSV(): Promise<void> {
    try {
      this.isLoading = true
      const res = await this.database.fetchCareManagementBillingSnapshot({
        status: 'active',
        limit: 'all',
        offset: 0,
        asOf: this.form.value.asOf.format('YYYY-MM-DD'),
        organization: environment.coachcareOrgId
      })

      if (!res.data) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }

      const filename = `clinic-patient-code-report-${moment().format(
        'YYYY-MM-DD'
      )}.csv`

      let csv = ''
      let headers =
        'ID' +
        this.csvSeparator +
        'Name' +
        this.csvSeparator +
        'Unique Patients' +
        this.csvSeparator

      for (const serviceType of this.serviceTypes()) {
        headers += `${serviceType.name} Unique Episodes of Care${this.csvSeparator}`
        for (const heading of this.setHeadings(serviceType.id)) {
          headers += `${heading}${this.csvSeparator}`
        }
      }

      const data: CsvRow = {}

      for (const serviceType of this.serviceTypes()) {
        for (const row of this.refreshData(serviceType.id, res.data, false)) {
          data[row.organization.id] = {
            organization: row.organization,
            patientsUniqueCount: row.patientsUniqueCount,
            codes: {
              ...data[row.organization.id]?.codes,
              [serviceType.id]: {
                uniqueRPMEpisodesOfCare: row.uniqueRPMEpisodesOfCare,
                codes: row.codes
              }
            }
          }
        }
      }

      csv += headers + '\n'

      for (const row of orderBy(
        Object.values(data),
        (item) => item.patientsUniqueCount,
        ['desc']
      )) {
        csv += `${row.organization.id}${this.csvSeparator}`
        csv += `${row.organization.name.replace(',', '')}${this.csvSeparator}`
        csv += `${row.patientsUniqueCount}${this.csvSeparator}`
        for (const serviceType of this.serviceTypes()) {
          const uniqueRPMEpisodesOfCare =
            row.codes[serviceType.id]?.uniqueRPMEpisodesOfCare
          csv += `${uniqueRPMEpisodesOfCare}${this.csvSeparator}`
          for (const code of row.codes[serviceType.id].codes) {
            csv += `${uniqueRPMEpisodesOfCare - code.satisfiedCount}${
              this.csvSeparator
            }`
            csv += `${code.satisfiedCount}${this.csvSeparator}`
          }
        }
        csv += '\n'
      }

      CSV.toFile({ content: csv, filename })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private refreshData(
    serviceType: string,
    data: FetchCareManagementBillingSnapshotResponse['data'],
    filterZero: boolean = true
  ): ClinicPatientCodeReport[] {
    this.setHeadings(serviceType)
    const reportData = this.compileUniqueClinics(serviceType, data)
    const patientCodes = this.flattenPatientCodes(data)
    this.setEligibilityPerPatientCode(patientCodes, reportData)
    if (filterZero) {
      return this.setCodesPerClinic(reportData).filter(
        (item) => item.uniqueRPMEpisodesOfCare > 0
      )
    }

    return this.setCodesPerClinic(reportData)
  }

  private setHeadings(serviceType: string): string[] {
    return this.billingCodes
      .filter((e) => e.serviceType.id === serviceType)
      .reduce((acc, item) => {
        if (item.coverage == 'monitoring') {
          if (item.requirements?.maxIterations == 1) {
            acc.push(`${item.value} Monitoring Time unsatisfied`)
            acc.push(`${item.value} Monitoring Time satisfied`)
          }
          if (item.requirements?.requiredLiveInteractionCount) {
            acc.push(`${item.value} Live Interaction unsatisfied`)
            acc.push(`${item.value} Live Interaction satisfied`)
          }
          if (item.requirements?.requiredLiveInteractionCount < 1) {
            return acc
          }
        }

        if (item.type == 'addon' && item.requirements?.maxIterations > 1) {
          acc.push(`${item.value} X1 unsatisfied`)
          acc.push(`${item.value} X1 satisfied`)
          acc.push(`${item.value} X2 unsatisfied`)
          acc.push(`${item.value} X2 satisfied`)
          return acc
        }
        acc.push(`${item.value} unsatisfied`)
        acc.push(`${item.value} satisfied`)
        return acc
      }, [])
  }

  private serviceTypes(): CareManagementServiceType[] {
    return uniqBy(
      this.billingCodes.map((e) => e.serviceType),
      'id'
    )
  }

  private compileUniqueClinics(
    serviceType: string,
    data: FetchCareManagementBillingSnapshotResponse['data']
  ): ClinicPatientCodeReport[] {
    return uniqBy(
      data.map((e) => e.organization),
      'id'
    ).map((org) => {
      return {
        organization: {
          id: org.id,
          name: org.name
        },
        //  with unique patient count
        patientsUniqueCount: uniq(
          data
            .filter((e) => e.organization.id === org.id)
            .map((e) => e.account.id)
        ).length,
        // @TODO should we remove possible unique patients or episodes of care that can't be satisfied this month?  Perhaps make a separate count for them?
        uniqueRPMEpisodesOfCare: data.filter(
          (e) =>
            e.organization.id === org.id &&
            e.state.serviceType.id === serviceType
        ).length,
        codes: this.billingCodes
          .filter((e) => e.serviceType.id === serviceType)
          .reduce((acc, item) => {
            if (
              item.coverage == 'monitoring' &&
              item.requirements?.requiredLiveInteractionCount
            ) {
              acc.push({
                serviceType: item.serviceType.name,
                cptCode: item.value,
                satisfiedCount: {
                  liveInteraction: 0,
                  monitoringTime: 0,
                  total: 0
                }
              })
              return acc
            }

            if (item.type == 'addon' && item.requirements?.maxIterations > 1) {
              acc.push({
                serviceType: item.serviceType.name,
                cptCode: item.value,
                satisfiedCount: {
                  iteration1: 0,
                  iteration2: 0
                }
              })
              return acc
            }
            acc.push({
              serviceType: item.serviceType.name,
              cptCode: item.value,
              satisfiedCount: 0
            })
            return acc
          }, [])
      }
    })
  }

  private flattenPatientCodes(
    data: FetchCareManagementBillingSnapshotResponse['data']
  ): PatientCodeRecord[] {
    return flatten(
      data.map((e) => {
        const flattenedCodes = e.billing.map((billingReport) => {
          return {
            organizationId: e.organization.id,
            cptCode: billingReport.code,
            willBeEligibleThisMonth: this.willBeEligible(billingReport)
          }
        })

        return flattenedCodes
      })
    )
  }

  private setEligibilityPerPatientCode(
    patientCodes: PatientCodeRecord[],
    reportData: ClinicPatientCodeReport[]
  ): void {
    for (const orgRecord of reportData) {
      for (const cptCodeRecord of orgRecord.codes) {
        let satisfiedCount

        if (
          typeof cptCodeRecord.satisfiedCount == 'object' &&
          'liveInteraction' in cptCodeRecord.satisfiedCount
        ) {
          satisfiedCount = {
            liveInteraction: this.filterPatientCodes(
              patientCodes,
              orgRecord.organization.id,
              cptCodeRecord.cptCode,
              'liveInteraction'
            ),
            monitoringTime: this.filterPatientCodes(
              patientCodes,
              orgRecord.organization.id,
              cptCodeRecord.cptCode,
              'monitoringTime'
            ),
            total: this.filterPatientCodes(
              patientCodes,
              orgRecord.organization.id,
              cptCodeRecord.cptCode,
              'total'
            )
          }
        } else if (
          typeof cptCodeRecord.satisfiedCount == 'object' &&
          'iteration1' in cptCodeRecord.satisfiedCount
        ) {
          satisfiedCount = {
            iteration1: this.filterPatientCodes(
              patientCodes,
              orgRecord.organization.id,
              cptCodeRecord.cptCode,
              'iteration1'
            ),
            iteration2: this.filterPatientCodes(
              patientCodes,
              orgRecord.organization.id,
              cptCodeRecord.cptCode,
              'iteration2'
            )
          }
        } else {
          satisfiedCount = this.filterPatientCodes(
            patientCodes,
            orgRecord.organization.id,
            cptCodeRecord.cptCode,
            null
          )
        }
        cptCodeRecord.satisfiedCount = satisfiedCount
      }
    }
  }

  private filterPatientCodes(
    patientCodes: PatientCodeRecord[],
    orgId: string,
    cptCode: string,
    eligibilityKey:
      | 'liveInteraction'
      | 'monitoringTime'
      | 'iteration1'
      | 'iteration2'
      | 'total'
      | null
  ): number {
    return patientCodes.filter(
      (e) =>
        e.organizationId === orgId &&
        cptCode === e.cptCode &&
        (eligibilityKey
          ? e.willBeEligibleThisMonth[eligibilityKey]
          : e.willBeEligibleThisMonth)
    ).length
  }

  private setCodesPerClinic(reportData): ClinicPatientCodeReport[] {
    const result: ClinicPatientCodeReport[] = orderBy(
      reportData.map((e) => {
        return {
          organization: e.organization,
          patientsUniqueCount: e.patientsUniqueCount,
          uniqueRPMEpisodesOfCare: e.uniqueRPMEpisodesOfCare,
          codes: e.codes.reduce((acc, item) => {
            if (typeof item.satisfiedCount == 'number') {
              acc.push({
                satisfiedCount: item.satisfiedCount
              })
            }

            if (
              typeof item.satisfiedCount == 'object' &&
              'monitoringTime' in item.satisfiedCount
            ) {
              acc.push({
                satisfiedCount: item.satisfiedCount.monitoringTime
              })
            }

            if (
              typeof item.satisfiedCount == 'object' &&
              'liveInteraction' in item.satisfiedCount
            ) {
              acc.push({
                satisfiedCount: item.satisfiedCount.liveInteraction
              })
            }

            if (
              typeof item.satisfiedCount == 'object' &&
              'total' in item.satisfiedCount
            ) {
              acc.push({
                satisfiedCount: item.satisfiedCount.total
              })
            }
            if (
              typeof item.satisfiedCount == 'object' &&
              'iteration1' in item.satisfiedCount
            ) {
              acc.push({
                satisfiedCount: item.satisfiedCount.iteration1
              })
            }

            if (
              typeof item.satisfiedCount == 'object' &&
              'iteration2' in item.satisfiedCount
            ) {
              acc.push({
                satisfiedCount: item.satisfiedCount.iteration2
              })
            }

            return acc
          }, [])
        }
      }),
      (item) => item.uniqueRPMEpisodesOfCare,
      ['desc']
    )

    const sum = result.reduce(
      (total: ClinicPatientCodeReport, entry) => {
        total.uniqueRPMEpisodesOfCare += entry.uniqueRPMEpisodesOfCare
        total.patientsUniqueCount += entry.patientsUniqueCount

        entry.codes.forEach((code, index) => {
          if (!total.codes[index]) {
            total.codes[index] = {
              ...code
            }
          } else {
            const totalCodes = total.codes.slice()
            ;(totalCodes[index].satisfiedCount as number) +=
              code.satisfiedCount as number
            total.codes = totalCodes
          }
        })

        return total
      },
      {
        uniqueRPMEpisodesOfCare: 0,
        organization: { id: '-', name: 'Sum' },
        patientsUniqueCount: 0,
        codes: []
      }
    )

    result.splice(0, 0, sum)

    return result
  }

  private willBeEligible(
    billingEntry: CareManagementSnapshotBillingItem
  ): SatisfiedCount {
    const billingCode = this.billingCodes.find(
      (e) => e.value === billingEntry.code
    )

    if (!billingCode) {
      return 0
    }

    // Get count of eligible previous billing iterations for this code if it occurred within the existing month
    const lastEligibilityValidForThisMonth =
      moment(billingEntry.eligibility?.last?.timestamp).isBetween(
        this.startOfThisMonth,
        this.startOfNextMonth
      ) && billingEntry.eligibility?.last?.count > 0
        ? billingEntry.eligibility.last.count
        : 0

    // If this code was never billable in the past OR if this code was not or will not be billable anytime during the currently-selected calendar month
    if (
      [
        billingEntry.eligibility?.next?.earliestEligibleAt,
        billingEntry.eligibility?.last?.timestamp
      ].every(
        (e) =>
          e === undefined ||
          !moment(e).isBetween(this.startOfThisMonth, this.startOfNextMonth)
      )
    ) {
      return 0
    } else if (
      billingCode.coverage == 'monitoring' &&
      billingCode.requirements?.requiredLiveInteractionCount
    ) {
      return {
        liveInteraction:
          lastEligibilityValidForThisMonth > 0 ||
          billingEntry.eligibility?.next?.liveInteraction?.count >=
            billingEntry.eligibility?.next?.liveInteraction?.required
            ? 1
            : 0,
        monitoringTime:
          lastEligibilityValidForThisMonth > 0 ||
          billingEntry.eligibility?.next?.monitoring?.total?.seconds?.tracked >=
            billingEntry.eligibility?.next?.monitoring?.total?.seconds?.required
            ? 1
            : 0,
        total:
          lastEligibilityValidForThisMonth > 0 ||
          (billingEntry.eligibility?.next?.liveInteraction?.count >=
            billingEntry.eligibility?.next?.liveInteraction?.required &&
            billingEntry.eligibility?.next?.monitoring?.total?.seconds
              ?.tracked >=
              billingEntry.eligibility?.next?.monitoring?.total?.seconds
                ?.required)
            ? 1
            : 0
      }
    } else if (
      billingCode.type === 'addon' &&
      billingCode.requirements?.maxIterations > 1
    ) {
      let iteration1 = 0
      let iteration2 = 0

      if (billingEntry.eligibility?.next?.alreadyEligibleCount) {
        iteration1 =
          billingEntry.eligibility.next.alreadyEligibleCount > 0 ? 1 : 0
        iteration2 =
          billingEntry.eligibility.next.alreadyEligibleCount > 1 ? 1 : 0
      } else if (lastEligibilityValidForThisMonth > 0) {
        iteration1 = lastEligibilityValidForThisMonth > 0 ? 1 : 0
        iteration2 = lastEligibilityValidForThisMonth > 1 ? 1 : 0
      }

      return {
        iteration1,
        iteration2
      }
    } else {
      return 1
    }
  }
}
