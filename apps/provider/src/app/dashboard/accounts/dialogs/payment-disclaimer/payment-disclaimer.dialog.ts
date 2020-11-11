import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { MatDialogRef } from '@coachcare/material'

@Component({
  selector: 'app-payment-disclaimer-dialog',
  templateUrl: 'payment-disclaimer.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class PaymentDisclaimerDialog implements OnInit {
  constructor(private dialogRef: MatDialogRef<PaymentDisclaimerDialog>) {}

  ngOnInit() {}

  onSubmit() {
    this.dialogRef.close(true)
  }
}
