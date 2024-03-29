import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  ContextService,
  FormsDatabase,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { Form } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subscription } from 'rxjs'
import { FormsDatasource } from '@app/dashboard/library/forms/models'
import { resolveConfig } from '@app/config/section'

interface AddNoteDialogData {
  formId: string
}

@UntilDestroy()
@Component({
  selector: 'add-note-dialog',
  templateUrl: 'add-note.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class AddNoteDialog implements OnDestroy, OnInit {
  public selectedClinic: SelectedOrganization
  private selectedClinicSubscription: Subscription

  form: FormGroup
  formsSource: FormsDatasource
  remoteForm: Form
  isLoading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddNoteDialogData,
    private builder: FormBuilder,
    private context: ContextService,
    private dialogRef: MatDialogRef<AddNoteDialog>,
    private forms: FormsDatabase,
    private notifier: NotifierService,
    protected database: FormsDatabase
  ) {}

  async ngOnInit() {
    try {
      this.createForm()
      this.formsSource = new FormsDatasource(
        this.context,
        this.forms,
        this.notifier
      )
      this.remoteForm = await this.formsSource.readForm({
        id: this.data.formId,
        full: true
      })
    } catch (error) {
      this.notifier.error(error)
      this.dialogRef.close()
    }

    this.selectedClinicSubscription = this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => this.resolveOrganization(organization))
  }

  ngOnDestroy(): void {
    this.selectedClinicSubscription.unsubscribe()
  }

  createForm() {
    this.form = this.builder.group({
      internalNote: ['', Validators.required]
    })
  }

  async resolveOrganization(org: SelectedOrganization) {
    const forceClinicAssociationOnNoteCreation = resolveConfig(
      'RIGHT_PANEL.FORCE_CLINIC_ASSOCIATION_ON_NOTE_CREATION',
      org
    )

    if (forceClinicAssociationOnNoteCreation) {
      this.selectedClinic =
        this.context.organizations.find(
          (entry) => entry.id === forceClinicAssociationOnNoteCreation
        ) ?? org
    } else {
      this.selectedClinic = org
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true
      const formData = this.form.value
      const submission = await this.formsSource.createFormSubmission({
        form: this.data.formId,
        account: this.context.accountId,
        submittedBy: this.context.user.id,
        answers: [
          {
            question: this.remoteForm.sections[0].questions[0].id,
            response: { value: formData.internalNote }
          }
        ],
        organization: this.selectedClinic.id
      })

      this.resetForm()
      this.dialogRef.close(submission.id)
      this.notifier.success(_('NOTIFY.SUCCESS.NOTE_ADDED'))
    } catch (error) {
      this.notifier.error(_('NOTIFY.ERROR.NOTE_ADDED'))
    } finally {
      this.isLoading = false
    }
  }

  resetForm(): void {
    this.createForm()
  }
}
