import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContextService, NotifierService } from '@app/service';
import { _, BindForm, BINDFORM_TOKEN } from '@app/shared';
import { ccrPhoneValidator } from '@app/shared/components/phone-input';
import { Account } from 'selvera-api';
import { AuthenticatorApp, AuthenticatorApps, MFAChannel, MFAChannels } from '../models';

export interface MFAVerificatorResetOpts {
  emitEvent?: boolean;
}

export type MFAVerificatorMode = 'auth' | 'sms' | 'backup_code';

@Component({
  selector: 'account-mfa-verificator',
  templateUrl: './mfa-verificator.component.html',
  styleUrls: ['./mfa-verificator.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => MFAVerificatorComponent)
    }
  ]
})
export class MFAVerificatorComponent implements BindForm, OnInit {
  @Input() isLoading: boolean;
  @Input() mode: MFAVerificatorMode;
  @Input() qrData: string;
  @Input() required: boolean = false;
  @Input() secretKey: string;

  @Output() reset: EventEmitter<void> = new EventEmitter<void>();
  @Output() submit: EventEmitter<void> = new EventEmitter<void>();

  authApps: AuthenticatorApp[] = [];
  channel: MFAChannel;
  channelExpired: boolean = false;
  channelTimeout: number = 300000;
  form: FormGroup;
  phoneForm: FormGroup;

  constructor(
    private account: Account,
    private context: ContextService,
    private fb: FormBuilder,
    private notify: NotifierService
  ) {}

  ngOnInit(): void {
    this.resolveAuthApps();
    this.resolveMFAChannel();
    this.createForm();
    this.onReset();
  }

  onReset(opts: MFAVerificatorResetOpts = {}): void {
    this.form.reset({ valid: true });
    this.channelExpired = false;
    if (opts.emitEvent) {
      this.reset.emit();
    }
    setTimeout(() => {
      this.channelExpired = true;
    }, this.channelTimeout);
  }

  onSubmit(): void {
    this.submit.emit();
  }

  async onSubmitPhone() {
    try {
      this.isLoading = true;
      const form = this.phoneForm.value;
      await this.account.update({
        id: this.context.user.id,
        phone: form.phone.phone,
        countryCode: form.phone.countryCode
      });
      await this.context.updateUser();
      this.onReset({ emitEvent: true });
      this.notify.success(_('NOTIFY.SUCCESS.PHONE_NUMBER_UPDATED'));
    } catch (error) {
      this.notify.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      code: ['', this.required ? Validators.required : []],
      valid: [true, Validators.requiredTrue]
    });

    this.phoneForm = this.fb.group({
      phone: [
        { phone: this.context.user.phone, countryCode: this.context.user.countryCode },
        [ccrPhoneValidator]
      ]
    });
  }

  private resolveMFAChannel(): void {
    Object.keys(MFAChannels).forEach((key) => {
      if (MFAChannels[key].code === this.mode) {
        this.channel = MFAChannels[key];
      }
    });
  }

  private resolveAuthApps(): void {
    this.authApps = Object.keys(AuthenticatorApps).map((key) => AuthenticatorApps[key]);
  }
}
