import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { NotifierService } from '@coachcare/common/services'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  MeasurementDataPointType,
  MeasurementDataPointTypeProvider
} from '@coachcare/sdk'
import { differenceBy, intersectionBy, isEqual } from 'lodash'
import { DataPointTypeTranslationEntry } from '../../components'

export interface EditDataPointTypeDialogProps {
  dataPointType: MeasurementDataPointType
}

@Component({
  selector: 'ccr-measurements-edit-data-point',
  templateUrl: 'edit-data-point-type.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class EditDataPointTypeDialog implements OnInit {
  public form: FormGroup
  public translationsEnabled: boolean

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EditDataPointTypeDialogProps,
    private dataPointType: MeasurementDataPointTypeProvider,
    private dialogRef: MatDialogRef<EditDataPointTypeDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    const dataPointType = this.data.dataPointType

    this.createForm()

    this.form.patchValue({
      name: dataPointType.name,
      description: dataPointType.description ?? null,
      translations: dataPointType.translations
    })

    if (dataPointType.translations?.length) {
      this.translationsEnabled = true
    }
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value

      // resolve the promises that should be executed to sync the translations
      const promises = this.resolveTranslationSyncPromises(
        formValue.translations
      )

      // execute these promises
      await Promise.all(promises)

      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public toggleTranslationsForm(value: MatSlideToggleChange): void {
    this.translationsEnabled = value.checked ?? false

    if (this.translationsEnabled) {
      this.form.get('translations').setValidators(Validators.required)
    } else {
      this.form.get('translations').setValidators(null)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      translations: [null]
    })
  }

  private resolveTranslationSyncPromises(
    currentTranslations: DataPointTypeTranslationEntry[]
  ): Promise<unknown>[] {
    const dataPointType = this.data.dataPointType
    const initialTranslations = (
      this.data.dataPointType.translations ?? []
    ).map((translation) => ({ ...translation, language: translation.locale }))

    return differenceBy(initialTranslations, currentTranslations, 'language')
      .map((translation) =>
        this.dataPointType.deleteLocale({
          locale: translation.locale,
          id: dataPointType.id
        })
      )
      .concat(
        intersectionBy(currentTranslations, initialTranslations, 'language')
          .filter((translation) => {
            const existingInitial = initialTranslations.find(
              (trans) => trans.language === translation.language
            )

            return !isEqual(existingInitial, translation)
          })
          .map((translation) =>
            this.dataPointType.upsertLocale({
              locale: translation.language,
              name: translation.name,
              description: translation.description || null,
              id: dataPointType.id
            })
          )
      )
      .concat(
        differenceBy(currentTranslations, initialTranslations, 'language').map(
          (translation) =>
            this.dataPointType.upsertLocale({
              locale: translation.language,
              name: translation.name,
              description: translation.description || undefined,
              id: dataPointType.id
            })
        )
      )
  }
}
