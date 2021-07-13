import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { BindForm, BINDFORM_TOKEN, CcrDropEvent } from '@app/shared'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-library-allowed-values-form',
  templateUrl: './allowed-values.form.component.html',
  styleUrls: ['./allowed-values.form.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => AllowedValuesFormComponent)
    }
  ]
})
export class AllowedValuesFormComponent implements BindForm, OnDestroy, OnInit {
  @Input()
  set content(allowedValues: string[]) {
    if (allowedValues && allowedValues.length) {
      this._content = allowedValues
      this.allowedValues = allowedValues
      this.refreshForm()
    }
  }

  get content(): string[] {
    return this._content
  }

  @Input()
  readonly = false

  public allowedValues: string[] = []
  public form: FormGroup

  private _content: string[]
  private defaultOptionString: string
  // This could be fetched from a translation JSON in order provide multilanguage support
  // --Zcyon
  private optionNameSource = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.createForm()
    this.updateDefaultOptionString()
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateDefaultOptionString())
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    if (!this.allowedValues || !this.allowedValues.length) {
      this.addOption()
    }
  }

  addOption(): void {
    this.allowedValues.push(
      this.defaultOptionString
        ? `${this.defaultOptionString} ${this.allowedValues.length + 1}`
        : ''
    )
    this.refreshForm()
  }

  getDisplayIndex(index: number): string {
    return (
      (index >= this.optionNameSource.length
        ? this.getDisplayIndex(
            ((index / this.optionNameSource.length) >> 0) - 1
          )
        : '') + this.optionNameSource[index % this.optionNameSource.length >> 0]
    )
  }

  onDrop($event: CcrDropEvent<string>): void {
    if ($event.drag === $event.drop) {
      return
    }
    const allowedValueCache: string = this.allowedValues[$event.drag]

    this.allowedValues[$event.drag] = this.allowedValues[$event.drop]
    this.allowedValues[$event.drop] = allowedValueCache

    this.refreshForm()
  }

  refreshForm(): void {
    this.form.patchValue({ value: this.allowedValues })
  }

  removeOption(index: number): void {
    this.allowedValues.splice(index, 1)
    this.refreshForm()
  }

  setAllowedValue($event: any, index: number): void {
    this.allowedValues[index] = $event.target.value
    this.refreshForm()
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      value: [
        [],
        (control) => {
          return control.value.length &&
            control.value.findIndex((option: string) => !option) > -1
            ? { emptyOption: true }
            : null
        }
      ]
    })
  }

  private updateDefaultOptionString(): void {
    this.translate
      .get('LIBRARY.FORMS.OPTION')
      .pipe(untilDestroyed(this))
      .subscribe(
        (defaultOptionString: string) =>
          (this.defaultOptionString = defaultOptionString)
      )
  }
}
