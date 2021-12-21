import { Component, Input } from '@angular/core'
import { NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import {
  CallRecordingEntry,
  CompletedCallRecording,
  Interaction
} from '@coachcare/sdk'

@Component({
  selector: 'app-call-recording-button',
  templateUrl: './call-recording-button.component.html',
  styleUrls: ['./call-recording-button.component.scss']
})
export class CallRecordingButtonComponent {
  @Input() callId: string

  public hasRecording = true
  public isLoading: boolean

  constructor(
    private interaction: Interaction,
    private notifier: NotifierService
  ) {}

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
        await this.interaction.getCallRecording({ id: this.callId })
      ).data.shift()
    } catch (error) {
      return
    }
  }
}
