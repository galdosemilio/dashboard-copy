import { EventEmitter } from '@angular/core'
import { AppLocale } from '@app/shared/utils'

export class LocaleSelectEvents {
  localeSelected: EventEmitter<any>
  localeDeselected: EventEmitter<any>

  constructor() {
    this.localeSelected = new EventEmitter<any>()
    this.localeDeselected = new EventEmitter<any>()
  }
}

export interface Locale extends AppLocale {
  checked?: boolean
}
