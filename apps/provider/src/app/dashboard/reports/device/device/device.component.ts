import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { ContextService } from '@app/service'
import {
  OrganizationEntity,
  CareManagementServiceType,
  CellularDeviceAssociation,
  FetchCellularDeviceAssociationRequest
} from '@coachcare/sdk'
import { select, Store } from '@ngrx/store'
import { isEmpty } from 'lodash'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { ReportsCriteria, ReportsDatabase } from '../../services'
import { criteriaSelector, ReportsState } from '../../store'
import { CcrPageSizeSelectorComponent } from '@app/shared/components/page-size-selector'
import { DeviceDataSource } from '../../services/device.datasource'
import { CSV } from '@coachcare/common/shared'
import { DeviceDetectorService } from 'ngx-device-detector'

@UntilDestroy()
@Component({
  selector: 'app-reports-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeviceComponent implements AfterViewInit, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  @ViewChild(CcrPageSizeSelectorComponent, { static: true })
  pageSizeSelectorComp: CcrPageSizeSelectorComponent

  @ViewChild('container') tableContainer: ElementRef

  @ViewChildren('columns') tableColumns: QueryList<ElementRef>

  public columns: string[] = ['index', 'firstName', 'lastName']
  public criteria: Partial<FetchCellularDeviceAssociationRequest> = {
    asOf: moment().format('YYYY-MM-DD')
  }
  public isLoading: boolean
  public rows: CellularDeviceAssociation[] = []
  public selectedClinic?: OrganizationEntity
  public source: DeviceDataSource
  public selectedServiceTypeId: string
  public selectedServiceType: CareManagementServiceType
  public isDesktop: boolean

  private selectedClinic$ = new Subject<OrganizationEntity | null>()
  private refresh$: Subject<void> = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ReportsDatabase,
    private deviceDetector: DeviceDetectorService,
    private store: Store<ReportsState>
  ) {}

  public ngAfterViewInit(): void {
    this.cdr.detectChanges()
    this.source
      .connect()
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((values) => {
        this.rows = values
      })
  }

  public ngOnInit(): void {
    this.isDesktop = this.deviceDetector.isDesktop()
    this.createDataSource()

    this.selectedClinic$.pipe(untilDestroyed(this)).subscribe((clinic) => {
      this.selectedClinic = clinic
      this.refresh()
    })
  }

  public onServiceTypeChange(event: string): void {
    this.selectedServiceTypeId = event
    this.selectedServiceType =
      this.context.user.careManagementServiceTypes.find(
        (entry) => entry.id === event
      )

    this.refresh()
  }

  public openPatientInNewTab(patientId: string): void {
    window.open(`./accounts/patients/${patientId}`, '_blank')
  }

  public downloadCSV(): void {
    let csv =
      'Patient ID,First Name,Last Name,Clinic #,Clinic Name,Device Added At,Device\n'
    const filename = `device-report-${
      this.context.organization.name
    }-${moment().format('YYYY-MM-DD')}.csv`

    this.source
      .fetch({
        ...this.source.args,
        limit: 'all',
        offset: 0
      })
      .subscribe((response) => {
        response.data.forEach((row) => {
          csv += `${row.account.id},${row.account.firstName},${row.account.lastName},${row.organization.id},${row.organization.name},${row.device.associatedAt},${row.device.type.name}\n`
        })

        CSV.toFile({
          content: csv,
          filename: filename
        })
      })
  }

  private createDataSource(): void {
    this.source = new DeviceDataSource(this.database, this.paginator)
    this.selectedClinic = this.context.organization

    this.source.addOptional(this.refresh$.pipe(debounceTime(500)), () => {
      const selectedDate = moment(this.criteria.asOf)

      return {
        asOf: selectedDate.isSameOrAfter(moment(), 'day')
          ? undefined
          : selectedDate.endOf('day').toISOString(),

        organization: this.selectedClinic?.id ?? undefined,
        serviceType: this.selectedServiceTypeId ?? undefined
      }
    })

    this.pageSizeSelectorComp.onPageSizeChange
      .pipe(untilDestroyed(this))
      .subscribe((pageSize) => {
        this.paginator.pageSize = pageSize ?? this.paginator.pageSize

        this.refresh()
      })

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (isEmpty(reportsCriteria)) {
          return
        }

        this.criteria.asOf = reportsCriteria.endDate
        this.paginator.firstPage()
        this.refresh$.next()
      })
  }

  private refresh(): void {
    if (this.paginator.pageIndex === 0) {
      this.refresh$.next()
      return
    }

    this.paginator.firstPage()
  }
}
