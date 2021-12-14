import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatSelectChange } from '@coachcare/material'
import { SelectorOption } from '@coachcare/common/shared'
import { LanguageService } from '@coachcare/common/services'
import { LOCALES } from '@coachcare/common/shared'
import { differenceWith } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'

interface InitialValueItem {
  locale: string
  content: string
}

@UntilDestroy()
@Component({
  selector: 'ccr-form-field-translated-text',
  templateUrl: './translated-text.component.html',
  styleUrls: ['./translated-text.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TranslatedTextFormFieldComponent implements OnDestroy, OnInit {
  @Input() initial: InitialValueItem[]
  @Input() label = ''

  @Output() update: EventEmitter<any> = new EventEmitter<any>()

  public availableLanguages: SelectorOption[] = []
  public form: FormGroup
  public languages: SelectorOption[] = []
  public selectedLanguages: SelectorOption[] = []

  private initialLoad = true

  constructor(private fb: FormBuilder, private language: LanguageService) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    this.resolveLanguages()

    setTimeout(() => {
      this.initialLoad = false
    }, 3000)

    if (!this.initial || !this.initial.length) {
      return
    }

    void this.loadInitialValues(this.initial)
  }

  public onNewLanguageSelect(event: MatSelectChange): void {
    if (typeof event.value !== 'string') {
      return
    }

    const selectorOption = this.languages.find(
      (language) => language.value === event.value
    )

    if (!selectorOption) {
      return
    }

    this.addLanguageFormControl(selectorOption.value)
    this.selectedLanguages = [...this.selectedLanguages, selectorOption]
    this.refreshAvailableLanguages()
    this.form.patchValue({ newLanguage: -1 })
  }

  public onRemoveLanguage(language: SelectorOption): void {
    this.selectedLanguages = this.selectedLanguages.filter(
      (lang) => lang.value !== language.value
    )

    this.refreshAvailableLanguages()
    this.removeLanguageFormControl(language.value)
  }

  private addLanguageFormControl(languageCode: string): FormControl {
    const textsGroup = this.form.controls.texts as FormGroup
    const newControl = new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ])

    textsGroup.addControl(languageCode, newControl)

    return newControl
  }

  private createForm(): void {
    this.form = this.fb.group(
      {
        texts: this.fb.group({}),
        newLanguage: [-1]
      },
      { validators: this.validateForm }
    )

    this.form.controls.texts.valueChanges
      .pipe(untilDestroyed(this), debounceTime(1500))
      .subscribe(() => {
        if (!this.form.valid || this.initialLoad) {
          return
        }

        this.update.emit(this.form.value.texts)
      })
  }

  private async loadInitialValues(initial: InitialValueItem[]): Promise<void> {
    initial.forEach((localeItem) => {
      this.onNewLanguageSelect({
        value: localeItem.locale,
        source: undefined as any
      })
      const textsGroup = this.form.controls.texts as FormGroup
      textsGroup.controls[localeItem.locale].setValue(localeItem.content, {
        emitEvent: false
      })
    })
  }

  private refreshAvailableLanguages(): void {
    this.availableLanguages = this.languages.filter(
      (language) =>
        !this.selectedLanguages.some(
          (selLanguage) => selLanguage.value === language.value
        )
    )
  }

  private removeLanguageFormControl(languageCode: string): void {
    const textsGroup = this.form.controls.texts as FormGroup
    textsGroup.removeControl(languageCode)
  }

  private resolveLanguages(): void {
    this.languages = differenceWith(
      LOCALES,
      this.language.localesBlacklist,
      (viewValue, value) => viewValue.code === value
    )
      .filter(
        (locale) => locale.code === 'ar-sa' || locale.code.indexOf('-') === -1
      )
      .map((locale) => ({
        value: locale.code,
        viewValue: `${locale.nativeName}`
      }))

    this.refreshAvailableLanguages()
  }

  private validateForm(control: FormControl): any {
    const value = control.value
    const errors = {}

    Object.keys(value.texts).forEach((key) => {
      if (!value.texts[key]) {
        errors[key] = true
      }
    })

    return Object.keys(errors).length ? errors : null
  }
}
