import { Component, forwardRef, Input, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { FormUtils, sleep } from '@app/shared/utils'
import { CareManagementServiceTypeId } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export type RPMEditFormComponentEditMode = 'edit' | 'readonly'

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-edit-form',
  templateUrl: './rpm-edit-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RPMEditFormComponent),
      multi: true
    }
  ]
})
export class RPMEditFormComponent implements ControlValueAccessor, OnInit {
  @Input() mode: RPMEditFormComponentEditMode = 'readonly'
  @Input() rpmEntry: RPMStateEntry
  @Input() showModeToggle = true

  get isRequiredSecondaryDiagnosis() {
    return this.rpmEntry.serviceType?.id === CareManagementServiceTypeId.CCM
  }

  public form: FormGroup

  constructor(private fb: FormBuilder, private formUtils: FormUtils) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn: any): void {}

  public writeValue(obj: any): void {
    if (!obj) {
      return
    }

    void this.patchValue(obj)
  }

  private createForm(): void {
    this.form = this.fb.group({
      primaryDiagnosis: ['', Validators.required],
      secondaryDiagnosis: [
        '',
        this.isRequiredSecondaryDiagnosis ? Validators.required : []
      ],
      otherDiagnosis: [''],
      note: ['', [Validators.required]]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) =>
        this.propagateChange(this.form.valid ? controls : null)
      )
  }

  private async patchValue(obj): Promise<void> {
    await sleep(100)
    this.form.patchValue(this.formUtils.pruneEmpty(obj))
  }

  private propagateChange(value: any): void {}
}
