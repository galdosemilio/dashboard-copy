import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { MatCheckboxChange } from '@angular/material/checkbox'
import { EcommerceProduct } from '@coachcare/common/model'
import { AppStoreFacade } from '@coachcare/common/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-checkout-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckoutProductItemComponent),
      multi: true
    }
  ]
})
export class CheckoutProductItemComponent
  implements ControlValueAccessor, OnInit
{
  @Input() checked: boolean
  @Input() disabled: boolean
  @Input() product: EcommerceProduct

  public imageBaseUrl: string

  private propagateChange: (checked: boolean) => {}
  private propagateTouched: () => {}

  constructor(private org: AppStoreFacade) {}

  public ngOnInit(): void {
    this.org.pref$.pipe(untilDestroyed(this)).subscribe((prefs) => {
      this.imageBaseUrl = prefs.storeUrl ?? ''
    })
  }

  public onValueChanges($event: MatCheckboxChange): void {
    this.checked = $event.checked
    this.propagateChange(this.checked)
    this.propagateTouched()
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled ?? false
  }

  public writeValue(checked: boolean): void {
    this.checked = checked ?? false
  }
}
