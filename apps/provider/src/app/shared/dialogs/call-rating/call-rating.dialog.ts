import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { callSelector, CallState } from '@app/layout/store/call'
import { ContextService, LoggingService, NotifierService } from '@app/service'
import { _, FormUtils } from '@app/shared/utils'
import { select, Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { take } from 'rxjs/operators'
import { AccountProvider } from '@coachcare/sdk'

type CallRatingOption = 'ok' | 'bad'

@UntilDestroy()
@Component({
  selector: 'ccr-call-rating',
  templateUrl: './call-rating.dialog.html',
  styleUrls: ['./call-rating.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class CallRatingDialog implements OnDestroy, OnInit {
  public currentUser: any
  public form: FormGroup
  public hoveredOption: string
  public isLoading: boolean
  public selectedOption: string
  public remotePeerLogData?: any

  private userLogData: any = {}

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private dialogRef: MatDialogRef<CallRatingDialog>,
    private fb: FormBuilder,
    private formUtils: FormUtils,
    private notifier: NotifierService,
    private logging: LoggingService,
    private store: Store<CallState>
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.refreshCurrentUser()
    this.createForm()

    this.store
      .pipe(select(callSelector), take(1), untilDestroyed(this))
      .subscribe(async (callState) => {
        try {
          const remotePeer = callState.room.participants.find(
            (participant) => participant.id !== this.context.user.id
          )

          if (!remotePeer) {
            throw new Error('no remote peer')
          }

          const remotePeerData = await this.account.getSingle(remotePeer.id)

          this.remotePeerLogData = {
            targetUserId: remotePeer.id,
            targetUserEmail: remotePeerData.email
          }
        } catch (error) {
          this.remotePeerLogData = {}
        }
      })
  }

  public markActiveOption(option: CallRatingOption): void {
    this.selectedOption = option
    this.form.patchValue({ selectedOption: this.selectedOption })
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true
      const formValue = this.formUtils.pruneEmpty(this.form.value)

      if (this.selectedOption === 'ok') {
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'client had a good experience',
            ...formValue,
            ...this.userLogData,
            ...this.remotePeerLogData
          }
        })
      } else {
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'client had issues',
            ...formValue,
            ...this.userLogData,
            ...this.remotePeerLogData
          }
        })
      }

      this.notifier.success(_('NOTIFY.SUCCESS.THANK_YOU_FEEDBACK'))
      this.dialogRef.close()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private refreshCurrentUser(): void {
    this.currentUser = this.context.user
    this.userLogData = {
      userId: this.currentUser.id,
      userEmail: this.currentUser.email,
      organizationId: this.context.organizationId,
      organizationName: this.context.organization.name
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      selectedOption: ['', Validators.required],
      additionalComments: [''],
      coachDeviceIssue: [''],
      patientDeviceIssue: [''],
      couldNotConnect: [''],
      unexpectedCallDrop: [''],
      other: ['']
    })
  }
}
