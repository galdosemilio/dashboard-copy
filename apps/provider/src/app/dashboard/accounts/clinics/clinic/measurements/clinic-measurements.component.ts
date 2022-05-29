import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _, sleep } from '@app/shared/utils'
import { MeasurementLabelActions } from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import { MatDialog } from '@coachcare/material'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementPreferenceProvider,
  NamedEntity,
  OrganizationProvider
} from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { debounceTime, filter } from 'rxjs/operators'
import {
  AddDataPointTypeDialog,
  AddDataPointTypeDialogProps,
  AddMeasurementLabelDialog,
  AddMeasurementLabelDialogProps
} from '../../dialogs'
import {
  MeasurementLabelDatabase,
  MeasurementLabelDataSource
} from '../../services'

@UntilDestroy()
@Component({
  selector: 'app-clinic-measurements',
  templateUrl: './clinic-measurements.component.html',
  styleUrls: ['./clinic-measurements.component.scss']
})
export class ClinicMeasurementsComponent implements OnInit {
  public colSpan = 1
  public currentMeasurementPref?: MeasurementPreferenceEntry
  public descendantTypeManagement?: boolean
  public form: FormGroup
  public ignoreFormChanges = true
  public inheritedClinic?: NamedEntity
  public isAdmin = false
  public reordering = false
  public source: MeasurementLabelDataSource
  public useDefaultMeasurementPreferenceAbout = {
    title: _('BOARD.CLINIC_USE_DEFAULT_MEASUREMENT_PREFERENCE'),
    description: _(
      'BOARD.CLINIC_USE_DEFAULT_MEASUREMENT_PREFERENCE_DESCRIPTION'
    )
  }
  public measurementAllowToChildClinicsAbout = {
    title: _('BOARD.CLINIC_MEASUREMENT_ALLOW_TO_CHILD_CLINICS'),
    description: _(
      'BOARD.CLINIC_MEASUREMENT_ALLOW_TO_CHILD_CLINICS_DESCRIPTION'
    )
  }

  constructor(
    private context: ContextService,
    private database: MeasurementLabelDatabase,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private measurementPreference: MeasurementPreferenceProvider,
    private notifier: NotifierService,
    private organization: OrganizationProvider,
    private store: Store<AppState>
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.createSource()
    void this.resolveAdminPerm()
    void this.fetchMeasurementPreference()
  }

  public toggleMeasurementLabelReordering(): void {
    this.reordering = !this.reordering
  }

  public showAddDataPointTypeDialog(): void {
    const availableMeasurementLabels = this.source.result.filter(
      (item) => item.level === 0
    )

    const usedDataPointTypes = this.source.result.filter(
      (item) => item.level === 1
    ) as MeasurementDataPointTypeAssociation[]

    this.dialog
      .open(AddDataPointTypeDialog, {
        data: {
          measurementLabels: availableMeasurementLabels,
          hasMeasurementPreference: this.currentMeasurementPref !== undefined,
          unavailableDataPointTypes: usedDataPointTypes.map((entry) => ({
            ...entry.type
          }))
        } as AddDataPointTypeDialogProps,
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => {
        void this.fetchMeasurementPreference()
        this.source.refresh()
        this.store.dispatch(MeasurementLabelActions.RefreshLabelsAndTypes())
      })
  }

  public showAddMeasurementLabelDialog(): void {
    const highestSortOrder = Math.max(
      ...this.source.result
        .filter((item) => item.level === 0)
        .map((item) => item.sortOrder ?? 0)
    )

    this.dialog
      .open(AddMeasurementLabelDialog, {
        data: { highestSortOrder } as AddMeasurementLabelDialogProps,
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => {
        this.source.refresh()
        this.store.dispatch(MeasurementLabelActions.RefreshLabelsAndTypes())
      })
  }

  private createForm(): void {
    this.form = this.fb.group({
      descendantTypeManagement: [false],
      inheritMeasurementPreference: [false]
    })

    this.form
      .get('inheritMeasurementPreference')
      .valueChanges.pipe(
        untilDestroyed(this),
        filter(() => !this.ignoreFormChanges),
        debounceTime(700)
      )
      .subscribe(
        (inherit) => void this.handleInheritMeasurementPreferenceChange(inherit)
      )

    this.form
      .get('descendantTypeManagement')
      .valueChanges.pipe(
        untilDestroyed(this),
        filter(() => !this.ignoreFormChanges),
        debounceTime(700)
      )
      .subscribe(
        (descendantTypeManagement) =>
          void this.handleDescendantTypeManagementChange(
            descendantTypeManagement
          )
      )
  }

  private createSource(): void {
    this.source = new MeasurementLabelDataSource(this.database, this.context)
    this.source.addDefault({
      organization: this.context.clinic.id,
      status: 'active',
      limit: 'all'
    })
  }

  private async fetchMeasurementPreference(): Promise<void> {
    try {
      this.ignoreFormChanges = true
      const single = await this.measurementPreference.getSingleMatching({
        organization: this.context.clinic.id,
        status: 'active'
      })

      this.currentMeasurementPref = single

      const isInherited = single.organization.id !== this.context.clinic.id

      this.descendantTypeManagement =
        single.descendantTypeManagement === 'active'

      this.inheritedClinic = isInherited
        ? await this.organization.getSingle(single.organization.id)
        : undefined

      this.form.patchValue(
        {
          descendantTypeManagement: this.descendantTypeManagement,
          inheritMeasurementPreference: isInherited
        },
        { emitEvent: false }
      )

      // we wait for a little bit because the Form values take a while to trigger the observers
      await sleep(100)

      this.ignoreFormChanges = false
    } catch (error) {
      this.inheritedClinic = undefined
      this.descendantTypeManagement = false

      this.form.patchValue(
        {
          descendantTypeManagement: this.descendantTypeManagement,
          inheritMeasurementPreference: false
        },
        { emitEvent: false }
      )
      this.notifier.error(error)

      this.ignoreFormChanges = false
    }
  }

  private async handleDescendantTypeManagementChange(
    descendantTypeManagement: boolean
  ): Promise<void> {
    try {
      if (this.currentMeasurementPref) {
        await this.measurementPreference.update({
          descendantTypeManagementEnabled: descendantTypeManagement,
          id: this.currentMeasurementPref.id
        })
      } else {
        await this.measurementPreference.create({
          descendantTypeManagementEnabled: descendantTypeManagement,
          organization: this.context.clinic.id
        })
      }

      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_PREF_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async handleInheritMeasurementPreferenceChange(
    inherit: boolean
  ): Promise<void> {
    try {
      if (inherit && this.currentMeasurementPref && !this.inheritedClinic) {
        await this.measurementPreference.delete({
          id: this.currentMeasurementPref.id
        })
      } else if (!inherit) {
        await this.measurementPreference.create({
          descendantTypeManagementEnabled: false,
          organization: this.context.clinic.id
        })
      }

      this.source.inheritsPreference = inherit
      await this.fetchMeasurementPreference()
      this.source.measurementPreference = this.currentMeasurementPref
      this.source.refresh()

      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_PREF_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveAdminPerm(): Promise<void> {
    try {
      this.isAdmin = await this.context.orgHasPerm(
        this.context.clinic.id,
        'admin'
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
