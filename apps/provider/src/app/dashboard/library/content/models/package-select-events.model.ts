import { EventEmitter } from '@angular/core'
import { Package } from '@app/shared/components/package-table'

export class PackageSelectEvents {
  packageSelected: EventEmitter<Package>
  packageDeselected: EventEmitter<Package>

  constructor() {
    this.packageSelected = new EventEmitter<Package>()
    this.packageDeselected = new EventEmitter<Package>()
  }
}
