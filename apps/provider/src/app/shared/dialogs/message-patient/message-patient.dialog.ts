import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { AccountRef, Messaging } from '@coachcare/npm-api'

export interface MessagePatientDialogProps {
  content?: string
  contentParams?: any
  initialMessage?: string
  target: AccountRef
  title: string
  titleParams?: any
}

@Component({
  selector: 'app-message-patient-dialog',
  templateUrl: './message-patient.dialog.html',
  styleUrls: ['./message-patient.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class MessagePatientDialog implements OnInit {
  public form: FormGroup
  public isLoading: boolean

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MessagePatientDialogProps,
    private context: ContextService,
    private dialogRef: MatDialogRef<MessagePatientDialog>,
    private fb: FormBuilder,
    private message: Messaging,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.loadInitialMessage()
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true
      const threads = (
        await this.message.getAll({
          accounts: [this.context.user.id, this.data.target.id],
          accountsExclusive: true,
          limit: 1,
          offset: 0
        })
      ).data

      let thread

      if (!threads.length) {
        thread = await this.message.createThread({
          organization: this.context.organizationId,
          subject: 'CoachCare Message',
          creatorId: this.context.user.id,
          accounts: [this.context.user.id, this.data.target.id]
        })
      } else {
        thread = threads[0]
      }

      await this.message.addMessage({
        organization: this.context.organizationId,
        subject: 'CoachCare Message',
        threadId: thread.threadId,
        content: this.form.value.message
      })
      this.notifier.success(_('NOTIFY.SUCCESS.MESSAGE_SENT_SUCCESSFULLY'))
      this.dialogRef.close()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      message: ['', Validators.required]
    })
  }

  private loadInitialMessage(): void {
    if (!this.data.initialMessage) {
      return
    }

    this.form.get('message').setValue(this.data.initialMessage)
  }
}
