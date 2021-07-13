import { Component, forwardRef, OnInit, ViewEncapsulation } from '@angular/core'
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { ContextService } from '@app/service'
import {
  localeList,
  SupportedLocale
} from '@app/shared/dialogs/languages.locales'
import { MeasurementLabelEntry } from '@coachcare/sdk/dist/lib/providers/measurement/label'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { differenceWith, get } from 'lodash'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-translated-text-input',
  templateUrl: './translated-text-input.component.html',
  styleUrls: ['./translated-text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TranslatedTextInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class TranslatedTextInputComponent
  implements ControlValueAccessor, OnInit {
  public addLangForm: FormGroup
  public availLangs: SupportedLocale['language'][] = []
  public translationForm: FormArray
  public translations: string[] = []

  private propagateChange: (data) => void = () => {}

  constructor(private context: ContextService, private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForms()
    this.resolveAvailLangs()
  }

  public onRemoveLanguage(index: number): void {
    this.translations.splice(index, 1)
    this.translationForm.removeAt(index)
  }

  public resolveSelectableLangs(
    current = { language: '' }
  ): Array<SupportedLocale['language']> {
    return this.availLangs.filter(
      (lang) =>
        lang.code === current.language ||
        this.translations.indexOf(lang.code) === -1
    )
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn: any): void {}

  public resolveLangFromValue(
    current = { language: '' }
  ): SupportedLocale['language'] {
    return (
      this.availLangs.find((lang) => lang.code === current.language) ?? {
        code: '',
        name: '',
        nativeName: ''
      }
    )
  }

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.translationForm.disable()
    } else {
      this.translationForm.enable()
    }
  }

  public writeValue(translations: MeasurementLabelEntry['translations']): void {
    if (!translations) {
      return
    }

    translations.forEach((translation) => {
      const existingTranslationIndex = this.translations.indexOf(
        translation.locale
      )

      // if the translation has been added already, we use the already existing form group
      if (existingTranslationIndex !== -1) {
        this.translationForm
          .get(existingTranslationIndex.toString())
          .patchValue({
            language: translation.locale,
            name: translation.name,
            description: translation.description ?? null
          })
        return
      }

      this.translationForm.push(
        this.createTranslationGroup({
          language: translation.locale,
          name: translation.name,
          description: translation.description ?? null
        })
      )

      this.translations.push(translation.locale)
    })
  }

  private createForms(): void {
    this.createTranslationForm()
    this.createLangForm()
  }

  private createLangForm(): void {
    this.addLangForm = this.fb.group({
      language: []
    })

    this.addLangForm
      .get('language')
      .valueChanges.pipe(
        untilDestroyed(this),
        filter((lang: string) => !!lang)
      )
      .subscribe((lang: string) => {
        this.addLangForm.reset({ language: '' }, { emitEvent: false })
        this.translationForm.push(
          this.createTranslationGroup({
            language: lang,
            name: null,
            description: null
          })
        )
        this.translations.push(lang)
      })
  }

  private createTranslationForm(): void {
    this.translationForm = this.fb.array([])

    this.translationForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        this.propagateChange(this.translationForm.valid ? controls : null)
      })
  }

  private createTranslationGroup(opts): FormGroup {
    const group = this.fb.group({
      language: [opts.language],
      name: [opts.name, Validators.required],
      description: [opts.description]
    })
    return group
  }

  private resolveAvailLangs(): void {
    this.availLangs = differenceWith(
      localeList,
      get(this.context.organization, 'mala.localesBlacklist', []),
      (viewValue, value) => viewValue.language.code === value
    ).map((lang) => lang.language)

    if (!this.availLangs.length) {
      return
    }

    this.addLangForm.patchValue({ language: '' })
  }
}
