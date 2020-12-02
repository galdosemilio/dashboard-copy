import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  AccountTypeInfo,
  AccountTypes,
  GetMFAOrganizationPreferenceResponse,
  MFA
} from '@coachcare/npm-api'
import { BindForm, BINDFORM_TOKEN } from '@coachcare/common/directives'
import { NotifierService } from '@coachcare/common/services'
import { intersectionBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { MFA_SECTIONS, MFASection } from '../models'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-settings-mfa-input',
  templateUrl: './mfa-input.component.html',
  styleUrls: ['./mfa-input.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => MFAInputComponent)
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class MFAInputComponent implements BindForm, OnDestroy, OnInit {
  @Input() organization: string
  @Input()
  set readonly(readonly: boolean) {
    this._readonly = readonly
    if (readonly && this.form) {
      this.form.disable()
    } else if (this.form) {
      this.form.enable()
    }
  }
  get readonly(): boolean {
    return this._readonly
  }

  accountTypes: AccountTypeInfo[] = []
  form: FormGroup
  mfaPref: GetMFAOrganizationPreferenceResponse
  sections: MFASection[] = []

  private _readonly: boolean
  private ignoredAccountTypeIds = ['4', '1']

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private mfa: MFA,
    private notify: NotifierService
  ) {
    this.processRawInput = this.processRawInput.bind(this)
  }

  ngOnDestroy() {}

  async ngOnInit() {
    this.createForm()
    await this.reload()
    this.resolveAccountTypes()
    await this.resolveAvailSections()
    this.setRawInputStatus(this.form.value.mfaEnabled || false)
    if (this.readonly) {
      this.form.disable()
      this.setRawInputStatus(false)
    }
  }

  onEditInherited() {
    this.form.controls['mfaInherit'].patchValue(false)
  }

  onMarkAsInherited() {
    this.form.controls['mfaInherit'].patchValue(true)
  }

  private createForm() {
    this.form = this.fb.group({
      mfaEnabled: null,
      mfaInherit: null,
      mfaPref: null,
      raw: this.fb.group({}),
      value: []
    })

    this.form.controls['mfaEnabled'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((enabled) => {
        if (!enabled) {
          const rawValue = this.form.controls['raw'].value
          const newRawValue = {}

          Object.keys(rawValue).forEach((rawSection) => {
            newRawValue[rawSection] = {}
            Object.keys(rawValue[rawSection]).forEach((rawAccType) => {
              newRawValue[rawSection][rawAccType] = false
            })
          })

          this.form.controls['raw'].patchValue(newRawValue)
        }
        this.setRawInputStatus(enabled || false)
      })
  }

  private setRawInputStatus(enabled: boolean) {
    if (enabled) {
      this.sections.forEach((section) => {
        const control = this.form.get(`raw.${section.id}`)
        if (control) {
          control.enable({ emitEvent: false })
        }
      })
    } else {
      this.sections.forEach((section) => {
        const control = this.form.get(`raw.${section.id}`)
        if (control) {
          control.disable({ emitEvent: false })
        }
      })
    }
  }

  private processRawInput(controls: any) {
    const mfaPref: GetMFAOrganizationPreferenceResponse = this.mfaPref
    const val: any[] = []
    Object.keys(controls).forEach((sectionId) => {
      Object.keys(controls[sectionId]).forEach((accTypeId) => {
        const existingSection = mfaPref
          ? mfaPref.sections.find(
              (section) =>
                section.accountType.id === accTypeId &&
                section.section.id === sectionId
            )
          : undefined
        if (existingSection) {
          val.push({
            ...existingSection,
            isRequired: controls[sectionId][accTypeId],
            inServer: true
          })
        } else {
          val.push({
            accountType:
              this.accountTypes.find((accType) => accType.id === accTypeId) ||
              null,
            isRequired: controls[sectionId][accTypeId] || false,
            inServer: false,
            section: {
              id: sectionId
            }
          })
        }
      })
    })
    this.form.controls['value'].setValue(val)
  }

  private resetRawControls() {
    const groupObject = {}
    this.sections.forEach((section) => {
      const sectionObject = {}
      this.accountTypes.forEach((type) => (sectionObject[type.id] = null))
      groupObject[section.id] = this.fb.group(sectionObject)
    })
    this.form.setControl('raw', this.fb.group(groupObject))
    this.form.controls['raw'].valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(this.processRawInput)

    if (this.mfaPref) {
      this.mfaPref.sections.forEach((section) => {
        const control = this.form.get(
          `raw.${section.section.id}.${section.accountType.id}`
        )
        if (control) {
          control.setValue(section.isRequired || false)
        }
      })
    }
  }

  private resolveAccountTypes() {
    this.accountTypes = Object.keys(AccountTypes)
      .map((key) => AccountTypes[key])
      .filter(
        (accountType) =>
          this.ignoredAccountTypeIds.indexOf(accountType.id) === -1
      )
  }

  private async resolveAvailSections() {
    try {
      const remoteSections = (await this.mfa.getMFASections()).data
      this.sections = intersectionBy(
        Object.keys(MFA_SECTIONS).map((key) => MFA_SECTIONS[key]),
        remoteSections,
        'id'
      )

      this.resetRawControls()
      this.cdr.detectChanges()
    } catch (error) {
      this.notify.error(error)
    }
  }

  public async reload() {
    try {
      this.mfaPref = await this.mfa.getOrganizationMFA({
        organization: this.organization,
        status: 'all'
      })
      this.form.controls['mfaEnabled'].setValue(
        this.mfaPref ? this.mfaPref.isActive : null
      )
      this.form.controls['mfaPref'].setValue(this.mfaPref || null)
    } catch (error) {}
  }
}
