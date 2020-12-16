import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export interface ImageOptionSelectorItem {
  imageSrc: string
  value: any
  viewValue: string
}

@Component({
  selector: 'ccr-image-option-selector',
  templateUrl: './image-option-selector.component.html',
  styleUrls: ['./image-option-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CcrImageOptionSelectorComponent),
      multi: true
    }
  ]
})
export class CcrImageOptionSelectorComponent implements ControlValueAccessor {
  @Input() options: ImageOptionSelectorItem[] = []

  public activeOption = -1
  public propagateChange = (_: any) => {}

  public selectOption(index: number): void {
    const option = this.options[index]

    if (!option) {
      return
    }

    this.activeOption = index
    this.propagateChange(option.value)
  }

  writeValue(value: string): void {
    const foundOptionIndex = this.options.findIndex(
      (opt) => opt.value === value
    )

    if (foundOptionIndex <= -1) {
      return
    }

    this.selectOption(foundOptionIndex)
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  registerOnTouched(): void {}
}
