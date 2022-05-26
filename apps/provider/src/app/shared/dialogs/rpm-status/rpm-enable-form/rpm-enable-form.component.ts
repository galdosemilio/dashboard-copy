import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators
} from '@angular/forms'
import { resolveConfig } from '@app/config/section'
import {
  SupervisingProvidersDatabase,
  SupervisingProvidersDataSource
} from '../services'
import { RPMDevice, RPM_DEVICES } from '@app/dashboard/reports/rpm/models'
import { ContextService, NotifierService } from '@app/service'
import { ImageOptionSelectorItem } from '@app/shared/components/image-option-selector'
import { _, SelectOption } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { OrganizationAccess, RPM } from '@coachcare/sdk'
import { MatStepper } from '@coachcare/material'
import { auditTime } from 'rxjs/operators'
import { Subject } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-enable-form',
  templateUrl: './rpm-enable-form.component.html',
  styleUrls: ['./rpm-enable-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RPMEnableFormComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class RPMEnableFormComponent implements ControlValueAccessor, OnInit {
  @Input() accessibleOrganizations: OrganizationAccess[] = []
  @Input() nextStep$?: Subject<void>

  @Output() enableFormStep: EventEmitter<number> = new EventEmitter<number>()

  @ViewChild('stepper', { static: true }) stepper: MatStepper

  public allowNoDeviceOption = false
  public form: FormGroup
  public blockFormError?: string
  public rpmDevices: ImageOptionSelectorItem[] = []
  public selectedClinic?: OrganizationAccess
  public supervisingProviderOptions: SelectOption<string>[] = []

  private additionalRpmDevices: RPMDevice[] = []
  private supervisingProvidersDataSource: SupervisingProvidersDataSource

  constructor(
    private context: ContextService,
    private database: SupervisingProvidersDatabase,
    private fb: FormBuilder,
    private notify: NotifierService,
    private rpm: RPM
  ) {
    this.validateRPMPreference = this.validateRPMPreference.bind(this)
  }

  public ngOnInit(): void {
    this.createForm()
    this.createSupervisingProvidersDataSource()
    this.resolveAccessibleOrgsData()
    this.subscribeToNextStep()
  }

  public onSupervisingProviderSelected(option: SelectOption<string>): void {
    this.form
      .get('setup')
      .get('supervisingProvider')
      .setValue(option?.value ?? '')
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn: any): void {
    this.markAsTouched = fn
  }

  public stepperChange($event: any): void {
    this.enableFormStep.emit($event.selectedIndex)
    this.form.updateValueAndValidity()
  }

  public writeValue(obj: any): void {}

  private createForm(): void {
    this.form = this.fb.group({
      setup: this.fb.group({
        organization: ['', Validators.required, this.validateRPMPreference],
        supervisingProvider: ['', Validators.required],
        primaryDiagnosis: ['', Validators.required],
        secondaryDiagnosis: ['']
      }),
      agreement: this.fb.group({
        patientConsented: [false, Validators.requiredTrue],
        hasMedicalNecessity: [false, Validators.requiredTrue],
        hadFaceToFace: [false, Validators.requiredTrue],
        goalsSet: [false, Validators.requiredTrue]
      }),
      deviceSupplied: ['', Validators.required]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this), auditTime(300))
      .subscribe((controls) => {
        if (controls.setup.organization) {
          this.selectedClinic =
            this.accessibleOrganizations.find(
              (clinic) => clinic.organization.id === controls.setup.organization
            ) ?? null
        }

        if (!this.resolveFormValidity(this.stepper.selectedIndex)) {
          this.propagateChange(null)
          return
        }

        this.propagateChange(controls)
      })

    this.form
      .get('setup')
      .get('organization')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((orgId) => {
        if (!orgId) {
          return
        }
        void this.resolveOrgSettings(orgId)
      })
  }

  private createSupervisingProvidersDataSource(): void {
    this.supervisingProvidersDataSource = new SupervisingProvidersDataSource(
      this.database
    )
    this.supervisingProvidersDataSource.addDefault({
      limit: 'all'
    } as any)
    this.supervisingProvidersDataSource.addRequired(
      this.form.get('setup').get('organization').valueChanges,
      () => ({ organization: this.form.get('setup').get('organization').value })
    )

    this.supervisingProvidersDataSource
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((associations) => {
        this.supervisingProviderOptions = associations.map((association) => ({
          value: association.account.id,
          viewValue: `${association.account.firstName} ${association.account.lastName}`
        }))

        this.verifySupervisingProviderSelection()
      })
  }

  private resolveFormValidity(stepIndex: number): boolean {
    let validity = false
    switch (stepIndex) {
      case 0:
        validity = this.form.get('setup').valid
        break
      case 1:
        validity = this.form.get('agreement').valid
        break
      case 2:
      default:
        validity = this.form.valid
        break
    }
    return validity
  }

  private markAsTouched(): void {}

  private propagateChange(data: any): void {}

  private resolveAccessibleOrgsData(): void {
    if (this.accessibleOrganizations && this.accessibleOrganizations.length) {
      this.form
        .get('setup')
        .get('organization')
        .setValue(this.accessibleOrganizations[0].organization.id)
    }
  }

  private resolveDevices(): void {
    this.rpmDevices = [
      ...Object.values(RPM_DEVICES),
      ...this.additionalRpmDevices
    ]
      .map((device) => ({
        value: device.id,
        viewValue: device.displayName,
        imageSrc: device.imageSrc,
        imageClass: device.imageClass || '',
        sortOrder: device.sortOrder
      }))
      .sort((prev, next) =>
        prev.sortOrder === -1
          ? 1
          : next.sortOrder === -1
          ? -1
          : prev.sortOrder - next.sortOrder
      )

    if (this.allowNoDeviceOption) {
      return
    }

    this.rpmDevices = this.rpmDevices.filter((device) => device.value !== '-1')

    if (this.form.value.deviceSupplied === '-1') {
      this.form.patchValue({ deviceSupplied: '' })
    }
  }

  private async resolveOrgSettings(orgId: string): Promise<void> {
    try {
      const orgSingle = await this.context.getOrg(orgId)

      const deviceSelectorSetting = resolveConfig(
        'RPM.ALLOW_NO_DEVICE_SELECTION',
        orgSingle
      )

      const additionalDevicesSetting = resolveConfig(
        'RPM.ADDITIONAL_DEVICES',
        orgSingle
      )

      this.allowNoDeviceOption =
        typeof deviceSelectorSetting === 'object'
          ? false
          : deviceSelectorSetting

      this.additionalRpmDevices = Array.isArray(additionalDevicesSetting)
        ? additionalDevicesSetting
        : []

      this.resolveDevices()
    } catch (error) {
      this.notify.error(error)
    }
  }

  private subscribeToNextStep(): void {
    if (!this.nextStep$) {
      return
    }

    this.nextStep$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.stepper.next())
  }

  private async validateRPMPreference(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    try {
      if (!control.value) {
        return
      }

      this.blockFormError = ''

      const pref = await this.rpm.getRPMPreferenceByOrg({
        organization: control.value
      })

      if (pref.isActive) {
        return null
      }

      this.blockFormError = _('NOTIFY.ERROR.RPM_NOT_ENABLED_CLINIC')
      return { invalidRPMPref: true }
    } catch (error) {
      this.notify.error(error)
    }
  }

  private verifySupervisingProviderSelection(): void {
    const currentSelection = this.form
      .get('setup')
      .get('supervisingProvider').value

    if (!currentSelection) {
      return
    }

    const supervisingProviderExists = this.supervisingProviderOptions.some(
      (provider) => provider.value === currentSelection
    )

    if (!supervisingProviderExists) {
      this.form.get('setup').patchValue({ supervisingProvider: '' })
    }
  }
}
