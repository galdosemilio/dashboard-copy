import { Component, forwardRef, Input, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { FormUtils, SelectOption } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  SupervisingProvidersDatabase,
  SupervisingProvidersDataSource
} from '../services'

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-supervising-provider-edit-form',
  templateUrl: './rpm-supervising-provider-edit-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RPMSupervisingProviderEditFormComponent),
      multi: true
    }
  ]
})
export class RPMSupervisingProviderEditFormComponent
  implements ControlValueAccessor, OnInit
{
  @Input() rpmEntry: RPMStateEntry

  public form: FormGroup
  public supervisingProviderOptions: SelectOption<string>[] = []
  public supervisingProvidersDataSource: SupervisingProvidersDataSource

  constructor(
    private fb: FormBuilder,
    private formUtils: FormUtils,
    private database: SupervisingProvidersDatabase
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.createSupervisingProvidersDataSource()
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
      account: ['', Validators.required],
      note: ['', Validators.required]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) =>
        this.propagateChange(this.form.valid ? controls : null)
      )
  }

  private createSupervisingProvidersDataSource(): void {
    this.supervisingProvidersDataSource = new SupervisingProvidersDataSource(
      this.database
    )
    this.supervisingProvidersDataSource.addDefault({
      limit: 'all',
      organization: this.rpmEntry.organization.id
    })

    this.supervisingProvidersDataSource
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((associations) => {
        this.supervisingProviderOptions = associations
          .map((association) => ({
            value: association.account.id,
            viewValue: `${association.account.firstName} ${association.account.lastName}`
          }))
          .filter(
            (entry) =>
              entry.value !== this.rpmEntry.rpmState.supervisingProvider?.id
          )

        this.verifySupervisingProviderSelection()
      })
  }

  private verifySupervisingProviderSelection(): void {
    const currentSelection = this.form.get('account').value

    if (!currentSelection) {
      return
    }

    const supervisingProviderExists = this.supervisingProviderOptions.some(
      (provider) => provider.value === currentSelection
    )

    if (!supervisingProviderExists) {
      this.form.patchValue({ account: '' })
    }
  }

  private async patchValue(obj): Promise<void> {
    this.form.patchValue(this.formUtils.pruneEmpty(obj))
  }

  private propagateChange(value: any): void {}

  public onSupervisingProviderSelected(option: SelectOption<string>): void {
    this.form.get('account').setValue(option?.value ?? '')
  }
}
