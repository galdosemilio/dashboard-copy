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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export type RPMEntryAgeStatus = 'before24' | 'after24' | 'after24Edited'
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
  @Input()
  set entryAge(entryAge: RPMEntryAgeStatus) {
    this._entryAge = entryAge

    if (this.form) {
      this.form
        .get('note')
        .setValidators(
          this._entryAge === 'after24' && this.mode !== 'readonly'
            ? [Validators.required]
            : []
        )
    }
  }

  get entryAge(): RPMEntryAgeStatus {
    return this._entryAge
  }

  @Input() mode: RPMEditFormComponentEditMode = 'readonly'
  @Input() rpmEntry: RPMStateEntry
  @Input() showModeToggle = true

  public form: FormGroup

  private _entryAge: RPMEntryAgeStatus

  constructor(private fb: FormBuilder, private formUtils: FormUtils) {}

  public ngOnInit(): void {
    this.createForm()
    this.mode = this.entryAge === 'after24Edited' ? 'readonly' : this.mode
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
      secondaryDiagnosis: [''],
      note: [
        '',
        this.entryAge === 'after24' && this.mode !== 'readonly'
          ? [Validators.required]
          : []
      ]
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
