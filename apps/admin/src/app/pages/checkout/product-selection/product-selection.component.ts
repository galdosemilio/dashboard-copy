import { Component, forwardRef, Input } from '@angular/core'
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { EcommerceProduct } from '@coachcare/common/model'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Client } from '@spree/storefront-api-v2-sdk'
import { IOAuthToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-checkout-product-selection',
  templateUrl: './product-selection.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckoutProductSelectionComponent),
      multi: true
    }
  ]
})
export class CheckoutProductSelectionComponent implements ControlValueAccessor {
  @Input() spreeClient: Client
  @Input() spreeToken: IOAuthToken

  public isDisabled: boolean
  public form: FormArray
  public products: EcommerceProduct[] = []

  private propagateChange: (productIds: string[]) => {}
  private propagateTouched: () => {}

  constructor(private fb: FormBuilder, private notifier: NotifierService) {}

  public ngOnInit(): void {
    void this.fetchProducts()
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  public writeValue(selectionArray: boolean[]): void {
    if (!this.form) {
      return
    }

    this.form.patchValue(selectionArray)
  }

  private async fetchProducts(): Promise<void> {
    try {
      const productsRes = await this.spreeClient.products.list(
        {
          bearerToken: this.spreeToken.access_token
        },
        { include: 'images' }
      )

      if (productsRes.isFail()) {
        throw new Error(productsRes.fail().message)
      }

      const included = productsRes.success().included

      this.products = productsRes
        .success()
        .data.map((entry) => new EcommerceProduct(entry, included))

      this.createFormArray(this.products.length)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createFormArray(length: number): void {
    this.form = this.fb.array(
      new Array(length).fill(0).map(() => new FormControl(false))
    )

    this.form.valueChanges
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((controls) => {
        this.propagateChange(this.calculateProductIds(controls))
        this.propagateTouched()
      })
  }

  private calculateProductIds(controls: boolean[]): string[] {
    return controls
      .map((entry, index) => (entry ? this.products[index].id : null))
      .filter((entry) => entry)
  }
}
