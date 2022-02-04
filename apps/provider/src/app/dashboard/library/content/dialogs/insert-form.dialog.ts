import { Component, forwardRef, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  CONTENT_TYPE_MAP,
  ContentUploadTicket,
  FileExplorerContent
} from '@app/dashboard/library/content/models'
import { ContextService, FormsDatabase, NotifierService } from '@app/service'
import { Form } from '@app/shared/model'
import { BindForm, BINDFORM_TOKEN } from '@app/shared/directives'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { FormsDatasource } from '../../forms/models'

@UntilDestroy()
@Component({
  selector: 'app-content-insert-form-dialog',
  templateUrl: './insert-form.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./insert-form.dialog.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => InsertFormDialog)
    }
  ]
})
export class InsertFormDialog implements BindForm, OnInit {
  public form: FormGroup
  public source: FormsDatasource
  public forms: Form[] = []
  mode: 'digital-library' | 'vault' = 'digital-library'
  organization: any
  public readonlyFields: string[] = ['name', 'description', 'availability']
  public selectedForm: Form
  public selectedFormContent: FileExplorerContent

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private context: ContextService,
    private database: FormsDatabase,
    private dialogRef: MatDialogRef<InsertFormDialog>,
    private formBuilder: FormBuilder,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.mode = this.data.mode || this.mode
    this.organization = this.data.organization || undefined
    this.createDatasource()
    this.createForm()
  }

  closeDialog() {
    const details = this.form.value.details
    this.dialogRef.close({
      contentUpload: {
        content: new FileExplorerContent({
          organization: {
            id: this.organization
              ? this.organization.id
              : this.context.organization.id,
            name: ''
          },
          name: details.name,
          type: CONTENT_TYPE_MAP.form,
          parentId: this.form.value.destination || undefined,
          description: details.description,
          isPublic: details.isPublic,
          packages: details.packages,
          metadata: {
            id: this.selectedForm.id
          }
        })
      }
    } as Partial<ContentUploadTicket>)
  }

  createDatasource() {
    this.source = new FormsDatasource(
      this.context,
      this.database,
      this.notifier
    )
    this.source.addDefault({
      organization: this.organization
        ? this.organization.id
        : this.context.organization.id
    })
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((forms: Form[]) => (this.forms = forms))
  }

  createForm() {
    this.form = this.formBuilder.group({
      details: [{}],
      query: [],
      selectedForm: [undefined, Validators.required],
      destination: [this.data.parent]
    })

    this.form.controls.query.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.selectedForm) {
          this.selectedForm = undefined
          this.selectedFormContent = undefined
          this.form.patchValue({ selectedForm: undefined })
        }
      })

    this.form.controls.query.valueChanges
      .pipe(untilDestroyed(this))
      .pipe(debounceTime(500))
      .subscribe(() => this.source.refresh())

    this.source.addRequired(
      this.form.controls.query.valueChanges
        .pipe(untilDestroyed(this))
        .pipe(debounceTime(500)),
      () => ({
        query: this.form.controls.query.value || undefined
      })
    )
  }

  onFormSelect($event: any) {
    this.selectedForm = this.forms.find(
      (f: Form) => f.name === $event.option.value
    )
    this.selectedFormContent = new FileExplorerContent({
      name: this.selectedForm.name,
      type: CONTENT_TYPE_MAP.form,
      organization: {
        id: this.organization
          ? this.organization.id
          : this.context.organization.id,
        name: ''
      },
      packages: []
    })
    this.form.patchValue({ selectedForm: this.selectedForm })
  }
}
