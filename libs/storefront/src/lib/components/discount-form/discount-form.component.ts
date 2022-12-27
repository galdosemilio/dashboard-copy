import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { NotifierService } from '@coachcare/common/services'
import {
  StorefrontCart,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'storefront-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.css']
})
export class StorefrontDiscountFormComponent implements OnInit, AfterViewInit {
  @Output() busy = new EventEmitter<boolean>()
  @ViewChild('input') input!: ElementRef
  public cart: StorefrontCart
  public discountInput = new FormControl('')

  public get couponCode(): string | null {
    return this.cart?.promotion?.attributes?.code
  }

  constructor(
    private storefront: StorefrontService,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.storefront.cart$
      .pipe(
        untilDestroyed(this),
        filter((res) => !!res)
      )
      .subscribe((res) => (this.cart = res))
  }

  ngAfterViewInit() {
    if (this.couponCode) {
      this.discountInput.setValue(this.couponCode)
    }
  }

  public async onApplyCouponCode() {
    if (!this.discountInput.value) {
      return
    }
    this.busy.emit(true)

    try {
      await this.storefront.applyCouponCode(this.discountInput.value)
    } catch (err) {
      this.notifier.error(err?.summary ?? err)
    } finally {
      this.busy.emit(false)
    }
  }

  public async onRemoveCouponCode(couponCode) {
    if (!couponCode) {
      return
    }
    this.busy.emit(true)

    try {
      await this.storefront.removeCouponCode(couponCode)
      this.discountInput.setValue('')
      this.input.nativeElement.blur()
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.busy.emit(false)
    }
  }
}
