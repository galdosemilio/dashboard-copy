import { EventEmitter } from '@angular/core'
import { Package } from './package.model'

export class PackageSelectEvents {
  packageSelected: EventEmitter<Package>
  packageDeselected: EventEmitter<Package>

  constructor() {
    this.packageSelected = new EventEmitter<Package>()
    this.packageDeselected = new EventEmitter<Package>()
  }
}
