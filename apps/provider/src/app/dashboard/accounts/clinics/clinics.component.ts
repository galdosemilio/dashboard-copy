import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog, MatSort, Sort } from '@coachcare/material'
import { resolveConfig } from '@app/config/section'
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store'
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime, filter, first } from 'rxjs/operators'
import { CreateClinicDialog } from './dialogs'
import { ClinicsDatabase, ClinicsDataSource } from './services'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { CSV } from '@coachcare/common/shared'
import { AllOrgPermissions } from '@coachcare/sdk'

@UntilDestroy()
@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicsComponent implements OnInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public clinic: SelectedOrganization
  public filterForm: FormGroup
  public permissions?: AllOrgPermissions
  public permissions$: Subject<AllOrgPermissions> =
    new Subject<AllOrgPermissions>()
  public query$: Subject<string | void> = new Subject<string>()
  public showCreateClinic = false
  public sort: MatSort = new MatSort()
  public source: ClinicsDataSource | null

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private database: ClinicsDatabase,
    private store: Store<UILayoutState>
  ) {}

  public ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
    this.source.disconnect()
  }

  public ngOnInit(): void {
    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org
      this.showCreateClinic =
        resolveConfig(
          'CLINIC_LISTING.SHOW_CLINIC_CREATE_BUTTON_DIRECT',
          org,
          true
        ) ||
        resolveConfig('CLINIC_LISTING.SHOW_CLINIC_CREATE_BUTTON', org) ||
        false
    })

    this.store.dispatch(new ClosePanel())
    // this.bus.trigger('organizations.enable-all');
    this.bus.trigger('right-panel.component.set', 'notifications')

    // setup the table source
    this.source = new ClinicsDataSource(
      this.notifier,
      this.database,
      this.paginator,
      this.sort
    )

    this.source.addOptional(this.query$, () => ({
      query: this.filterForm.value.query
    }))

    this.source.addOptional(this.permissions$, () => ({
      ...this.permissions
    }))

    this.createFilterForm()
  }

  public createDialog(): void {
    this.dialog
      .open(CreateClinicDialog, {
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  public async downloadCSV(): Promise<void> {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      const source = new ClinicsDataSource(this.notifier, this.database)
      source.addDefault({ offset: 0, limit: 'all' })

      const associations = await source.connect().pipe(first()).toPromise()

      const csvSeparator = ','
      let csv = 'CLINICS REPORT\r\n'
      csv +=
        `"ID"${csvSeparator}` +
        `"Hierarchy"${csvSeparator}` +
        `"Name"${csvSeparator}` +
        `"Country"${csvSeparator}` +
        `"Address"${csvSeparator}` +
        `"City"${csvSeparator}` +
        `"State"${csvSeparator}` +
        `"ZIP"${csvSeparator}` +
        `"Contact Information"` +
        '\r\n'

      associations.forEach((association) => {
        csv += `"${association.organization.id || ''}"${csvSeparator}`
        csv += `"${association.organization.hierarchyPath.toString()}"${csvSeparator}`
        csv += `"${association.organization.name || ''}"${csvSeparator}`
        csv += `"${
          association.organization.address.country || ''
        }"${csvSeparator}`
        csv += `"${
          association.organization.address.street || ''
        }"${csvSeparator}`
        csv += `"${association.organization.address.city || ''}"${csvSeparator}`
        csv += `"${
          association.organization.address.state || ''
        }"${csvSeparator}`
        csv += `"${
          association.organization.address.postalCode || ''
        }"${csvSeparator}`
        csv += `"${association.organization.contact.firstName || ''} ${
          association.organization.contact.lastName || ''
        }\n${association.organization.contact.email || ''}\n${
          association.organization.contact.phone
        }"`
        csv += '\r\n'
      })

      CSV.toFile({
        content: csv,
        filename: `${this.context.organization.name} Clinic Report`
      })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  public filterByPermissions(permissions: AllOrgPermissions): void {
    this.permissions = permissions
    this.permissions$.next(permissions)
  }

  public onSorted(sort: Sort): void {
    this.sort.active = sort.active
    this.sort.direction = sort.direction
    this.sort.sortChange.emit(sort)
  }

  private createFilterForm(): void {
    this.filterForm = this.fb.group({ query: [] })

    this.filterForm.controls.query.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.query$.next()
        this.paginator.firstPage()
      })
  }
}
