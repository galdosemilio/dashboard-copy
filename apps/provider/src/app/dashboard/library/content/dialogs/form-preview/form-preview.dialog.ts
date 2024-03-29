import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ContextService, FormsDatabase, NotifierService } from '@app/service'
import { Form } from '@app/shared/model'
import { FormSingle } from '@coachcare/sdk'
import { map } from 'rxjs/operators'
import { FileExplorerContent } from '../../models'

interface FormPreviewDialogProps {
  content: FileExplorerContent
}

@Component({
  selector: 'app-form-preview-dialog',
  templateUrl: './form-preview.dialog.html',
  styleUrls: ['./form-preview.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class FormPreviewDialog implements OnInit {
  public form: Form

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: FormPreviewDialogProps,
    private database: FormsDatabase,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    void this.resolveForm()
  }

  private async resolveForm(): Promise<void> {
    try {
      const opts = {
        organization: this.context.organization.id,
        inServer: true
      }

      const response = await this.database
        .readForm({ id: this.data.content.metadata.id, full: true })
        .pipe(map((form: FormSingle) => new Form(form, opts)))
        .toPromise()

      this.form = response
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
