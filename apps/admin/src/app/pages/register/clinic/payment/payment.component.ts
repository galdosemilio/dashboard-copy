import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { _ } from '@coachcare/backend/shared'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import { StripeService } from '@coachcare/common/services'
import { ContextService } from '@coachcare/common/services'
import { OrgPrefSelectors, OrgPrefState } from '@coachcare/common/store'
import { select, Store } from '@ngrx/store'
import { get } from 'lodash'

@Component({
  selector: 'ccr-page-register-clinic-payment',
  templateUrl: './payment.component.html'
})
export class RegisterClinicPaymentPageComponent
  implements OnInit, AfterViewInit
{
  @Input() formGroup: FormGroup
  @Input() isLoading: boolean
  @Input() required = true

  @Output() nextStep = new EventEmitter()

  @ViewChild('cardNumber', { static: false })
  cardNumberEl: ElementRef
  @ViewChild('cardExpiry', { static: false })
  cardExpiryEl: ElementRef
  @ViewChild('cardCvc', { static: false })
  cardCvcEl: ElementRef

  elements: any
  cardNumber: any
  errorMessage = ''
  isProcessing = false
  acceptedCheckbox = false
  linkMsa: string

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private stripeService: StripeService,
    private store: Store<OrgPrefState.State>
  ) {}

  ngOnInit() {
    if (this.context.organizationId) {
      this.store
        .pipe(select(OrgPrefSelectors.selectOrgPref))
        .subscribe((pref) => {
          this.linkMsa = get(pref, 'mala.custom.links.msa')
        })
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.setUpCard()
    }
  }

  setUpCard() {
    this.elements = this.stripeService.stripe.elements()
    const style = {
      base: {
        fontSize: '16px',
        letterSpacing: '0.02rem',
        textTransform: 'none'
      }
    }
    this.cardNumber = this.elements.create('cardNumber', {
      style: style
    })
    const cardExpiry = this.elements.create('cardExpiry', { style: style })
    const cardCvc = this.elements.create('cardCvc', { style: style })

    this.cardNumber.mount(this.cardNumberEl.nativeElement)
    cardExpiry.mount(this.cardExpiryEl.nativeElement)
    cardCvc.mount(this.cardCvcEl.nativeElement)

    this.cardNumber.addEventListener('change', (event: Event) => {
      this.stripeElementError(event)
    })
    cardExpiry.addEventListener('change', (event: any) => {
      this.stripeElementError(event)
    })
    cardCvc.addEventListener('change', (event: any) => {
      this.stripeElementError(event)
    })

    this.cardNumber.addEventListener('submit', this.onSubmit.bind(this))
    cardExpiry.addEventListener('submit', this.onSubmit.bind(this))
    cardCvc.addEventListener('submit', this.onSubmit.bind(this))
  }

  stripeElementError(event: any): void {
    this.errorMessage = event.error ? event.error.message : ''
  }

  onSkip(): void {
    if (this.isProcessing) {
      return
    }
    const token = this.formGroup.get('token') as FormControl
    token.setValue('')
    this.nextStep.emit()
  }

  onSubmit(): void {
    if (this.isProcessing || !this.acceptedCheckbox) {
      return
    }
    this.isProcessing = true

    this.stripeService
      .createToken(this.cardNumber)
      .then((res: any) => {
        if (res.error) {
          this.errorMessage = res.error.message
        } else {
          const token = this.formGroup.get('token') as FormControl
          token.setValue(res.token.id)
          this.nextStep.emit()
        }
        this.isProcessing = false
      })
      .catch((res: any) => {
        this.errorMessage = res.error.message
        this.dialog.open(ConfirmDialog, {
          data: {
            title: _('GLOBAL.ERROR'),
            content: this.errorMessage
          }
        })
        this.isProcessing = false
      })
  }
}
