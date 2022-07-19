import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { StorefrontPaymentMethod } from '@coachcare/storefront/model'

@Component({
  selector: 'storefront-payment-method-entry',
  templateUrl: './payment-method-entry.component.html',
  styleUrls: ['./payment-method-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'section-list-item' }
})
export class StorefrontPaymentMethodEntryComponent {
  @Input() disabled: boolean
  @Input() paymentMethod: StorefrontPaymentMethod

  @Output() onDelete: EventEmitter<StorefrontPaymentMethod> =
    new EventEmitter<StorefrontPaymentMethod>()
  @Output() onSetDefault: EventEmitter<StorefrontPaymentMethod> =
    new EventEmitter<StorefrontPaymentMethod>()
}
