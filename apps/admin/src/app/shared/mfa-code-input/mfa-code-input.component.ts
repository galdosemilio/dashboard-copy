import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BindForm, BINDFORM_TOKEN } from '@coachcare/common/directives'

export type MFACodeInputMode = 'mfa_sms' | 'auth' | 'backup_code' | 'default'

@Component({
  selector: 'ccr-mfa-code-input',
  templateUrl: './mfa-code-input.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => MFACodeInputComponent)
    }
  ]
})
export class MFACodeInputComponent implements BindForm, OnInit {
  @Input() loading: boolean
  @Input() mode: MFACodeInputMode = 'mfa_sms'
  @Input() cancellable = true

  @Output() modeChange: EventEmitter<MFACodeInputMode> = new EventEmitter<
    MFACodeInputMode
  >()
  @Output() resendSMS: EventEmitter<void> = new EventEmitter<void>()
  @Output() reset: EventEmitter<void> = new EventEmitter<void>()
  @Output() submit: EventEmitter<void> = new EventEmitter<void>()

  form: FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm()
  }

  onResendSMS(): void {
    this.form.reset()
    this.resendSMS.emit()
  }

  onSubmit(): void {
    this.submit.emit()
  }

  setMode(mode: MFACodeInputMode): void {
    this.mode = mode
    this.modeChange.emit(this.mode)
    this.form.reset()
  }

  private createForm(): void {
    this.form = this.fb.group({ code: ['', Validators.required] })
  }
}
