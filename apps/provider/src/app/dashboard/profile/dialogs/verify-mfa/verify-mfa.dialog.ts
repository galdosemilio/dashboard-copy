import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@coachcare/common/material';
import { ContextService, NotifierService } from '@app/service';
import { _, BindForm, BINDFORM_TOKEN } from '@app/shared';
import {
  CreateUserMFARequest,
  CreateUserMFAResponse,
  VerifyUserMFARequest,
} from '@app/shared/selvera-api';
import { MFA } from 'selvera-api';
import { MFAChannel } from '../../models';

export interface VerifyMFADialogProps {
  channel: MFAChannel;
}

export type VerifyMFADialogMode =
  | 'auth'
  | 'backup_codes'
  | 'loading'
  | 'sms'
  | 'unknown';

@Component({
  selector: 'account-verify-mfa-dialog',
  templateUrl: './verify-mfa.dialog.html',
  styleUrls: ['./verify-mfa.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => VerifyMFADialog),
    },
  ],
})
export class VerifyMFADialog implements BindForm, OnInit {
  backupCodes: string[] = [];
  backupCodesTimeout: number = 10000;
  channel: MFAChannel;
  currentMfa: CreateUserMFAResponse;
  form: FormGroup;
  isLoading: boolean;
  mode: VerifyMFADialogMode = 'loading';
  qrData: string;
  secretKey: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: VerifyMFADialogProps,
    private context: ContextService,
    private fb: FormBuilder,
    private mfa: MFA,
    private notify: NotifierService
  ) {}

  async ngOnInit() {
    this.channel = this.data.channel;
    this.form = this.fb.group({});
    await this.checkExistingMFA();
    this.onAccept();
  }

  async onAccept() {
    try {
      if (this.currentMfa) {
        await this.deleteExistingMFA(this.currentMfa);
      }

      const request: CreateUserMFARequest = {
        channel: this.channel.id,
        organization: this.context.organizationId,
      };
      this.isLoading = true;
      this.currentMfa = await this.mfa.createUserMFA(request);
      this.qrData = decodeURIComponent(this.currentMfa.qrCodeUrl || '');
      this.mode = this.channel.code as VerifyMFADialogMode;
      this.secretKey = this.qrData
        ? this.qrData.match(/secret\=[a-zA-Z0-9]*/)[0].replace(/secret\=/, '')
        : '';
    } catch (error) {
      this.notify.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    try {
      const form = this.form.value;
      const request: VerifyUserMFARequest = {
        id: this.currentMfa.id,
        code:
          form.code && form.code.code ? form.code.code.replace(/\s/g, '') : '',
      };
      this.isLoading = true;
      const backupCodes = await this.mfa.verifyUserMFA(request);
      this.notify.success(_('NOTIFY.SUCCESS.MFA_VERIFIED'));
      this.backupCodes = backupCodes.data;
      this.mode = 'backup_codes';
    } catch (error) {
      this.notify.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  onDownloadBackupCodes() {
    let text = '';
    const filename = `${this.channel.name}_${this.context.organization.name}_backup_codes`;

    this.backupCodes.forEach((code) => {
      text += `${code}\r\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('visibility', 'hidden');
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private async checkExistingMFA() {
    try {
      const existingMFA = await this.mfa.getUserMFA({
        organization: this.context.organizationId,
      });

      if (existingMFA && !existingMFA.isVerified) {
        await this.mfa.deleteUserMFA({
          id: existingMFA.id,
          organization: this.context.organizationId,
        });
      }
    } catch (error) {}
  }

  private deleteExistingMFA(existingMFA: CreateUserMFAResponse): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        await this.mfa.deleteUserMFA({
          id: existingMFA.id,
          organization: this.context.organizationId,
        });
      } catch (error) {
      } finally {
        resolve();
      }
    });
  }
}
