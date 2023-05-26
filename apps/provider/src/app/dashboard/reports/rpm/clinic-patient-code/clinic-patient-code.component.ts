import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit
} from '@angular/core'
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
  CareManagementStateSummaryItem,
  FetchCareManagementBillingSnapshotResponse
} from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchCareManagementBillingSnapshotResponse.interface'
import { ClinicPatientCodeDataSource } from '../../services/clinic-patient-code-report.datasource'
import { Subject, debounceTime } from 'rxjs'
import { NotifierService } from '@app/service'
import { CSV } from '@coachcare/common/shared'
import { Sort } from '@angular/material/sort'

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
export class ClinicPatientCodeComponent implements OnInit, AfterViewInit {
  public criteria: Partial<FetchCareManagementBillingSnapshotRequest> = {
    organization: environment.coachcareOrgId
  }
  public rows: CareManagementStateSummaryItem[] = []
  public source: ClinicPatientCodeDataSource

  constructor(
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
  private refresh$: Subject<void> = new Subject<void>()
  private rawData: FetchCareManagementBillingSnapshotResponse['data']
  private startOfNextMonth = moment()
    .add(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD')

  public async ngOnInit(): Promise<void> {
    this.source = new ClinicPatientCodeDataSource(this.database, this.notifier)
    this.source.addDefault({ status: 'active', limit: 'all', offset: 0 })
    const billingCodesResponse =
      await this.database.fetchCareManagementBillingCodes({
        asOf: moment().format('YYYY-MM-DD')
      })

    this.billingCodes = billingCodesResponse.data

    this.refresh$.pipe(debounceTime(500)).subscribe(() => {
      this.headings = this.setHeadings(this.serviceType)
      this.tableData = this.refreshData(this.serviceType)
    })
  }

  public ngAfterViewInit(): void {
    this.source
      .connect()
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((data) => {
        this.rawData = data
        this.headings = this.setHeadings(this.serviceType)
        this.tableData = this.refreshData(this.serviceType)
      })
  }

  public async onServiceTypeChange(serviceType: string): Promise<void> {
    this.serviceType = serviceType
    this.refresh$.next()
  }

  public sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.tableData = this.refreshData(this.serviceType)
      return
    }

    this.tableData = orderBy(
      this.refreshData(this.serviceType),
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

  public downloadCSV(): void {
    if (!this.rawData.length) {
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
      for (const row of this.refreshData(serviceType.id, false)) {
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
  }

  private refreshData(
    serviceType: string,
    filterZero: boolean = true
  ): ClinicPatientCodeEntry[] {
    const reportData = this.compileUniqueClinics(serviceType)
    const patientCodes = this.flattenPatientCodes()
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

  private compileUniqueClinics(serviceType: string): ClinicPatientCodeReport[] {
    return uniqBy(
      this.rawData.map((e) => e.organization),
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
          this.rawData
            .filter((e) => e.organization.hierarchyPath.includes(org.id))
            .map((e) => e.account.id)
        ).length,
        // @TODO should we remove possible unique patients or episodes of care that can't be satisfied this month?  Perhaps make a separate count for them?
        uniqueRPMEpisodesOfCare: this.rawData.filter(
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

  private flattenPatientCodes(): PatientCodeRecord[] {
    return flatten(
      this.rawData.map((e) => {
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
