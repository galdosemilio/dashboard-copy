import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'ccr-wellcore-quantity-selector',
  templateUrl: './quantity-selector.component.html',
  styleUrls: ['./quantity-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WellcoreQuantitySelectorComponent),
      multi: true
    }
  ]
})
export class WellcoreQuantitySelectorComponent
  implements ControlValueAccessor, OnInit {
  @Input() max = 999
  @Input() min = 1

  public set currentAmount(amount: number) {
    this._currentAmount = amount
    this.checkMinMaxThreshold()
    this.propagateChange(this._currentAmount)
    this.propagateTouched()
  }

  public get currentAmount(): number {
    return this._currentAmount
  }

  public hasReachedMax = false
  public hasReachedMin = false
  public isDisabled = false

  private _currentAmount = 1
  private propagateChange: (values) => void = () => {}
  private propagateTouched: () => void = () => {}

  public ngOnInit(): void {
    this.checkMinMaxThreshold()
  }

  public add(): void {
    this.currentAmount = Math.min(this.max, ++this.currentAmount)
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public subtract(): void {
    this.currentAmount = Math.max(this.min, --this.currentAmount)
  }

  public writeValue(amount: number): void {
    this.currentAmount = amount ?? this.currentAmount
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  private checkMinMaxThreshold(): void {
    this.hasReachedMax = this.currentAmount === this.max
    this.hasReachedMin = this.currentAmount === this.min
  }
}
