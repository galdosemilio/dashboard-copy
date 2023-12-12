import { Component, OnInit, ViewEncapsulation, forwardRef } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { ContextService } from '@app/service'
import { BINDFORM_TOKEN } from '@app/shared'
import { Observable, of } from 'rxjs'

@Component({
  selector: 'account-delete-dialog',
  templateUrl: './delete-account.dialog.html',
  styleUrls: ['./delete-account.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => DeleteAccountDialog)
    }
  ]
})
export class DeleteAccountDialog implements OnInit {
  public form: FormGroup
  public email: string

  constructor(
    private context: ContextService,
    private fb: FormBuilder,
    private dialog: MatDialogRef<DeleteAccountDialog>
  ) {
    this.emailValidator = this.emailValidator.bind(this)
  }

  async ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required, this.emailValidator]
    })
    this.email = this.context.user.email
  }

  async onDelete() {
    this.dialog.close(true)
  }

  private emailValidator(
    control: AbstractControl
  ): Observable<ValidationErrors | null> {
    return control.value !== this.context.user.email
      ? of({ noMatchEmail: true })
      : of(null)
  }
}
