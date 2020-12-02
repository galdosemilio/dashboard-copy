import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { GetUserMFAResponse } from '@coachcare/npm-api'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { MFA } from '@coachcare/npm-api'
import { VerifyDeleteMFADialog, VerifyMFADialog } from '../dialogs'
import { MFAChannel, MFAChannels } from '../models'

export type MFASetupComponentMode =
  | 'auth'
  | 'backup_codes'
  | 'delete'
  | 'intro'
  | 'sms'

@UntilDestroy()
@Component({
  selector: 'account-mfa-setup',
  templateUrl: './mfa-setup.component.html',
  styleUrls: ['./mfa-setup.component.scss']
})
export class MFASetupComponent implements OnDestroy, OnInit {
  set isLoading(isLoading: boolean) {
    this._isLoading = isLoading
    if (isLoading) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  get isLoading(): boolean {
    return this._isLoading
  }

  channels: MFAChannel[] = []
  currentChannel: MFAChannel
  existingMFA: GetUserMFAResponse
  form: FormGroup
  mode: MFASetupComponentMode

  private _isLoading = false

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private mfa: MFA,
    private notify: NotifierService
  ) {}

  ngOnDestroy(): void {}

  async ngOnInit() {
    try {
      this.createForm()
      await this.fetchExistingChannel()
      const remoteChannels = (await this.mfa.getMFAChannels()).data
      this.channels = []
      remoteChannels.forEach((channel) =>
        this.channels.push(new MFAChannel(channel))
      )
      if (this.existingMFA) {
        this.channels = this.channels.filter(
          (channel) => channel.id === this.existingMFA.channel.id
        )
      }
      this.channels.push(
        new MFAChannel({
          id: '',
          code: 'disabled',
          name: 'Disabled',
          displayName: _('PROFILE.MFA.DISABLED'),
          steps: []
        })
      )
    } catch (error) {
      this.notify.error(error)
    }
  }

  async disableChannel() {
    try {
      await this.mfa.deleteUserMFA({
        id: this.existingMFA.id,
        organization: this.context.organizationId || ''
      } as any)

      this.dialog
        .open(VerifyDeleteMFADialog, {
          data: {
            existingMFA: this.existingMFA
          },
          disableClose: true,
          width: '80vw',
          panelClass: 'ccr-full-dialog'
        })
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(() => this.reset())
    } catch (error) {
      this.notify.error(error)
    }
  }

  async onAcceptIntro() {
    try {
      this.setUp(this.currentChannel)
    } catch (error) {
      this.notify.error(error)
    }
  }

  onCancel(): void {
    if (this.existingMFA) {
      this.form.controls.channel.setValue(
        MFAChannels[this.existingMFA.channel.id].code,
        {
          emitEvent: false
        }
      )
    } else {
      this.form.controls.channel.setValue('disabled')
    }
    delete this.mode
  }

  reset(): void {
    delete this.mode
    this.ngOnInit()
  }

  setUp(channel: MFAChannel): void {
    this.dialog
      .open(VerifyMFADialog, {
        data: { channel },
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.reset())
  }

  private async fetchExistingChannel() {
    try {
      this.isLoading = true
      const existingMFA = await this.mfa.getUserMFA({
        organization: this.context.organizationId
      })
      this.existingMFA = existingMFA.isVerified ? existingMFA : undefined
      if (this.existingMFA) {
        this.form.controls.channel.setValue(
          MFAChannels[this.existingMFA.channel.id].code,
          { emitEvent: false }
        )
      }
    } catch (error) {
      delete this.existingMFA
    } finally {
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      channel: ['disabled']
    })

    this.form.controls.channel.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((channel) => {
        if (
          !this.existingMFA ||
          channel !== MFAChannels[this.existingMFA.channel.id].code
        ) {
          switch (channel) {
            case 'disabled':
              if (this.existingMFA) {
                this.mode = 'delete'
              } else {
                delete this.mode
              }
              break
            default:
              this.currentChannel = this.channels.find(
                (chnnl) => chnnl.code === channel
              )
              this.mode = 'intro'
              break
          }
        } else {
          delete this.mode
        }
      })
  }
}
