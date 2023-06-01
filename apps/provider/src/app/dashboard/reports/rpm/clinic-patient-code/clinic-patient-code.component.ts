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
import { debounceTime } from 'rxjs'
import { NotifierService } from '@app/service'
import { CSV } from '@coachcare/common/shared'
import { ContextService } from '@coachcare/common/services'
import { Sort } from '@angular/material/sort'
import { FormBuilder, FormGroup } from '@angular/forms'

type SatisfiedCount = number | SatisfiedCount99457 | SatisfiedCount99458

interface ClinicPatientCodeEntry {
  organization: { id: string; name: string }
  patientsUniqueCount: number
  uniqueRPMEpisodesOfCare: number
  codes: SatisfiedCount[]
}

interface SatisfiedCount99457 {
  liveInteraction: number
  monitoringTime: number
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
  organization: { id: string; name: string; hierarchyPath: string[] }
  patientsUniqueCount: number
  codes: ClinicPatientCodeReportCode[]
}

interface PatientCodeRecord {
  orgHierarchy: string[]
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
  public tableData: ClinicPatientCodeEntry[]
  public reportData: ClinicPatientCodeReport[]
  public headings: string[] = []
  public serviceType: string
  public billingCodes: BillingCode[]
  public isLoading: boolean = false
  public asOfMax = moment().endOf('day')
  private rows: FetchCareManagementBillingSnapshotResponse['data'] = []
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
        serviceType: this.form.value.serviceType || undefined
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

        void this.refreshDataWithBillingCodesChange()
      })

    this.source
      .connect()
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((data) => {
        this.rows = data
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
        asOf: this.form.value.asOf.format('YYYY-MM-DD')
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
  ): ClinicPatientCodeEntry[] {
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
        if (
          item.coverage == 'monitoring' &&
          item.requirements?.requiredLiveInteractionCount
        ) {
          acc.push(`${item.value} Live Interaction`)
        }
        if (
          item.coverage == 'monitoring' &&
          item.requirements?.maxIterations == 1
        ) {
          acc.push(`${item.value} Monitoring Time`)
          return acc
        }
        if (item.type == 'addon' && item.requirements?.maxIterations > 1) {
          acc.push(`${item.value} X1`)
          acc.push(`${item.value} X2`)
          return acc
        }
        acc.push(item.value)
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
          name: org.name,
          hierarchyPath: org.hierarchyPath
        },
        //  with unique patient count
        patientsUniqueCount: uniq(
          data
            .filter((e) => e.organization.hierarchyPath.includes(org.id))
            .map((e) => e.account.id)
        ).length,
        // @TODO should we remove possible unique patients or episodes of care that can't be satisfied this month?  Perhaps make a separate count for them?
        uniqueRPMEpisodesOfCare: data.filter(
          (e) =>
            e.organization.hierarchyPath.includes(org.id) &&
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
                  monitoringTime: 0
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
            orgHierarchy: e.organization.hierarchyPath,
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
      | null
  ): number {
    return patientCodes.filter(
      (e) =>
        e.orgHierarchy.includes(orgId) &&
        cptCode === e.cptCode &&
        (eligibilityKey
          ? e.willBeEligibleThisMonth[eligibilityKey]
          : e.willBeEligibleThisMonth)
    ).length
  }

  private setCodesPerClinic(reportData): ClinicPatientCodeEntry[] {
    return orderBy(
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
              'liveInteraction' in item.satisfiedCount
            ) {
              acc.push({
                satisfiedCount: item.satisfiedCount.liveInteraction
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

    if (
      billingEntry.eligibility?.next?.earliestEligibleAt === undefined ||
      billingEntry.eligibility.next.earliestEligibleAt > this.startOfNextMonth
    ) {
      return 0
    } else if (
      billingCode.coverage == 'monitoring' &&
      billingCode.requirements?.requiredLiveInteractionCount
    ) {
      return {
        liveInteraction:
          billingEntry.eligibility.next.liveInteraction.count >=
          billingEntry.eligibility.next.liveInteraction.required
            ? 1
            : 0,
        monitoringTime:
          billingEntry.eligibility.next.monitoring.total.seconds.tracked >=
          billingEntry.eligibility.next.monitoring.total.seconds.required
            ? 1
            : 0
      }
    } else if (
      billingCode.type === 'addon' &&
      billingCode.requirements?.maxIterations > 1
    ) {
      return {
        iteration1:
          billingEntry.eligibility.next.alreadyEligibleCount > 0 ? 1 : 0,
        iteration2:
          billingEntry.eligibility.next.alreadyEligibleCount > 1 ? 1 : 0
      }
    } else {
      return 1
    }
  }
}
