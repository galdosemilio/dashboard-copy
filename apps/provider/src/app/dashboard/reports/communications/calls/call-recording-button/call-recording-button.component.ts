import { Component, Input, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import { MatDialog } from '@coachcare/material'
import {
  CallRecordingEntry,
  CompletedCallRecording,
  Feedback,
  Interaction,
  InteractionSingle
} from '@coachcare/sdk'
import { UntilDestroy } from '@ngneat/until-destroy'
import * as moment from 'moment'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-call-recording-button',
  templateUrl: './call-recording-button.component.html',
  styleUrls: ['./call-recording-button.component.scss']
})
export class CallRecordingButtonComponent implements OnInit {
  @Input() call: InteractionSingle

  public currentRecordingEntry?: CallRecordingEntry
  public hasDownloadPermission = true
  public hasRecording = true
  public hasSentSuppReq = false
  public icon:
    | 'file_download'
    | 'loop'
    | 'file_download_off'
    | 'report_problem' = 'file_download'
  public isLoading: boolean
  public showRequestSupportBtn = false
  public tooltip = ''

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private interaction: Interaction,
    private notifier: NotifierService,
    private feedback: Feedback
  ) {
    this.createSupportTicket = this.createSupportTicket.bind(this)
    this.createComposition = this.createComposition.bind(this)
  }

  public async ngOnInit(): Promise<void> {
    this.hasDownloadPermission =
      (await this.context.orgHasPerm(
        this.call.organization.id,
        'allowClientPhi',
        true
      )) &&
      (await this.context.orgHasPerm(
        this.call.organization.id,
        'viewAll',
        true
      ))
  }

  public onClick(): void {
    if (this.isLoading || !this.hasRecording) {
      return
    }

    if (this.currentRecordingEntry?.status !== 'failed') {
      void this.tryDownloadComposition()
    } else {
      // show the dialog to retry the composition
      this.showRetryCompositionDialog()
    }
  }

  public showSupportDialog(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('REPORTS.RECORDING_ASSISTANCE'),
          content: _('REPORTS.CALL_RECORDING_PROCESS_ERROR'),
          yes: _('BOARD.SUBMIT_SUPPORT_REQUEST'),
          no: _('GLOBAL.CANCEL')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(this.createSupportTicket)
  }

  private async createSupportTicket(): Promise<void> {
    try {
      await this.feedback.sendFeedback({
        organization: this.context.organizationId,
        title: 'Video Recording Support Assistance',
        description: `This is an automated support request. Please assist coach ${
          this.context.user.firstName
        } ${this.context.user.lastName} ID: ${
          this.context.user.id
        } in attempting to process or download call ID: ${
          this.call.id
        }. The video recording timestamp: ${
          this.currentRecordingEntry?.createdAt ?? '(unavailable)'
        }`
      })

      this.hasSentSuppReq = true
      this.notifier.success(_('NOTIFY.SUCCESS.SUPPORT_TICKET_CREATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveCallRecordingEntry(): Promise<
    CallRecordingEntry | undefined
  > {
    try {
      return (
        await this.interaction.getCallRecording({ id: this.call.id })
      ).data.shift()
    } catch (error) {
      return
    }
  }

  private refreshBtnElements(recordingEntry: CallRecordingEntry): void {
    this.showRequestSupportBtn = false
    this.tooltip = ''

    switch (recordingEntry.status) {
      case 'enqueued':
      case 'processing':
        this.icon = 'loop'
        this.showRequestSupportBtn =
          Math.abs(moment(recordingEntry.createdAt).diff(moment(), 'hours')) >=
          8
        this.tooltip = _('REPORTS.CALL_BEING_PROCESSED_NO_DOWNLOAD')
        break

      case 'deleted':
        this.icon = 'file_download_off'
        this.tooltip = _('REPORTS.CALL_RECORDING_DELETED')
        break

      case 'failed':
        this.icon = 'report_problem'
        this.tooltip = _('REPORTS.CALL_RECORDING_FAILED_CLICK_RETRY')
        break
    }
  }

  private showRetryCompositionDialog(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('REPORTS.PROCESS_RECORDING_TITLE'),
          content: _('REPORTS.PROCESS_RECORDING_DESCRIPTION'),
          yes: _('REPORTS.CREATE_DOWNLOADABLE_FILE'),
          no: _('GLOBAL.CANCEL')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(this.createComposition)
  }

  private async createComposition(): Promise<void> {
    try {
      await this.interaction.createCallRecording({ id: this.call.id })
      this.currentRecordingEntry.status = 'processing'
      this.refreshBtnElements(this.currentRecordingEntry)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async tryDownloadComposition(): Promise<void> {
    try {
      this.isLoading = true
      const recordingEntry = await this.resolveCallRecordingEntry()
      this.currentRecordingEntry = recordingEntry

      if (!recordingEntry) {
        this.hasRecording = false
        throw new Error(
          _('NOTIFY.ERROR.CALL_HAS_NO_RECORDING') //'Call has no recording'
        )
      }

      this.refreshBtnElements(recordingEntry)

      this.hasRecording = recordingEntry.status !== 'deleted'

      if (recordingEntry.status === 'deleted') {
        throw new Error(
          _('NOTIFY.ERROR.CALL_HAS_NO_RECORDING') //'Call has no recording'
        )
      }

      if (
        recordingEntry.status === 'enqueued' ||
        recordingEntry.status === 'processing'
      ) {
        throw new Error(
          _('NOTIFY.ERROR.CALL_BEING_PROCESSED') // 'Call recording is still being processed, please try again later'
        )
      }

      if (recordingEntry.status === 'failed') {
        throw new Error(
          _('NOTIFY.ERROR.CALL_PROCESSING_FAILED') //'Call recording processing failed, please contact support'
        )
      }

      window.open(
        (recordingEntry as CompletedCallRecording).url.value,
        '_blank'
      )
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
