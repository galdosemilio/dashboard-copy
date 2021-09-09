import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NotifierService } from '@app/service'
import { bufferedRequests, _ } from '@app/shared'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { MeasurementLabelEntry } from '@coachcare/sdk/dist/lib/providers/measurement/label'
import { MeasurementLabelProvider } from '@coachcare/sdk/dist/lib/services'
import { differenceBy, intersectionBy, isEqual } from 'lodash'

export interface EditMeasurementLabelDialogProps {
  label: MeasurementLabelEntry
}

interface MeasurementLabelTranslationEntry {
  description: string
  language: string
  name: string
}

@Component({
  selector: 'app-clinics-edit-measurement-label-dialog',
  templateUrl: './edit-measurement-label.component.html',
  host: { class: 'ccr-dialog' }
})
export class EditMeasurementLabelDialog implements OnInit {
  public form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EditMeasurementLabelDialogProps,
    private dialogRef: MatDialogRef<EditMeasurementLabelDialog>,
    private fb: FormBuilder,
    private measurementLabel: MeasurementLabelProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    const label = this.data.label
    this.createForm()

    this.form.get('value').patchValue({
      name: label.name,
      description: label.description ?? null,
      translations: label.translations.map((translation) => ({
        ...translation,
        language: translation.locale
      }))
    })
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        return
      }

      const formValue = this.form.value.value

      // update the label entry per se
      await this.measurementLabel.update({
        id: this.data.label.id,
        name: formValue.name,
        description: formValue.description || null
      })

      // resolve the promises that should be executed to sync the translations
      const promises = this.resolveTranslationSyncPromises(
        formValue.translations
      )

      // execute these promises
      await bufferedRequests(promises)

      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_LABEL_UPDATED'))
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      value: [null, Validators.required]
    })
  }

  private resolveTranslationSyncPromises(
    currentTranslations: MeasurementLabelTranslationEntry[]
  ): Promise<void>[] {
    const label = this.data.label
    const initialTranslations = (
      this.data.label.translations ?? []
    ).map((translation) => ({ ...translation, language: translation.locale }))
    return differenceBy(initialTranslations, currentTranslations, 'language')
      .map((translation) =>
        this.measurementLabel.deleteLocale({
          locale: translation.locale,
          id: label.id
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
            this.measurementLabel.upsertLocale({
              locale: translation.language,
              name: translation.name,
              description: translation.description || null,
              id: label.id
            })
          )
      )
      .concat(
        differenceBy(currentTranslations, initialTranslations, 'language').map(
          (translation) =>
            this.measurementLabel.upsertLocale({
              locale: translation.language,
              name: translation.name,
              description: translation.description || undefined,
              id: label.id
            })
        )
      )
  }
}
