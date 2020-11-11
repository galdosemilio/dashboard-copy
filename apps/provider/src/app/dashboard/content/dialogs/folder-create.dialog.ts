import { Component, forwardRef, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialogRef
} from '@coachcare/material'
import {
  CONTENT_TYPE_MAP,
  ContentUploadTicket,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { ContextService } from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'

@Component({
  selector: 'app-content-folder-create-dialog',
  templateUrl: './folder-create.dialog.html',
  styleUrls: ['./folder-create.dialog.scss'],
  host: { class: 'ccr-dialog' },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FolderCreateDialog)
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class FolderCreateDialog implements BindForm, OnInit {
  public form: FormGroup
  mode: 'digital-library' | 'vault' = 'digital-library'
  organization: any

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FolderCreateDialog>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode || this.mode
    this.organization = this.data.organization || undefined
    this.createForm()
  }

  createFolder(): void {
    if (this.form.invalid) {
      return
    }

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
          type: CONTENT_TYPE_MAP.folder,
          parentId: this.form.value.destination || undefined,
          description: details.description,
          isPublic: details.isPublic,
          packages: details.packages,
          metadata: {}
        })
      }
    } as Partial<ContentUploadTicket>)
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      destination: [this.data.parent]
    })
  }
}
