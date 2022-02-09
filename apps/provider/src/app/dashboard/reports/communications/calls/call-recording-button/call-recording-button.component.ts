import { Component, Input, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import {
  CallRecordingEntry,
  CompletedCallRecording,
  Interaction,
  InteractionSingle
} from '@coachcare/sdk'
import { UntilDestroy } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-call-recording-button',
  templateUrl: './call-recording-button.component.html',
  styleUrls: ['./call-recording-button.component.scss']
})
export class CallRecordingButtonComponent implements OnInit {
  @Input() call: InteractionSingle

  public hasDownloadPermission = true
  public hasRecording = true
  public isLoading: boolean

  constructor(
    private context: ContextService,
    private interaction: Interaction,
    private notifier: NotifierService
  ) {}

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

  public async onClick(): Promise<void> {
    if (this.isLoading || !this.hasRecording) {
      return
    }

    try {
      this.isLoading = true
      const recordingEntry = await this.resolveCallRecordingEntry()

      if (!recordingEntry) {
        this.hasRecording = false
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
        this.hasRecording = false
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
}
