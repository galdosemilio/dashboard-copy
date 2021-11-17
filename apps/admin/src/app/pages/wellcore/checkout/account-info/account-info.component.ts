import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { range, uniqBy } from 'lodash'

interface SelectOption {
  value: string | number
  name: string
}

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-account-info',
  templateUrl: './account-info.component.html'
})
export class WellcoreAccountComponent implements OnInit, OnDestroy {
  @Input() accountCreated = false
  @Input() formGroup: FormGroup

  constructor() {}

  public startDate = new Date(1960, 0, 1)
  public heights: SelectOption[] = []
  public genders: SelectOption[] = [
    { value: 'male', name: 'Male' },
    { value: 'female', name: 'Female' }
  ]

  ngOnInit() {
    this.heights = uniqBy(
      range(92, 216).map((value) => ({
        name: this.convertCentimetersToFeetInches(value),
        value: value
      })),
      (v) => v.name
    )

    this.formGroup
      .get('height')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          return
        }

        this.formGroup
          .get('heightDisplayValue')
          .setValue(this.heights.find((height) => height.value === value).name)
      })
  }

  ngOnDestroy() {}

  private convertCentimetersToFeetInches(centimeters: number): string {
    const product = centimeters / 0.0254 / 100
    const ft = Math.floor(product / 12)
    const inch = Math.floor(product % 12)

    return `${ft}’${inch}"`
  }
}
