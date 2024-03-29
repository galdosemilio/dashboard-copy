import { Injectable } from '@angular/core'
import { CanDeactivate } from '@angular/router'
import { STORAGE_COACHES_PAGINATION } from '@app/config'

@Injectable()
export class ListingPaginationGuard implements CanDeactivate<void> {
  canDeactivate(): boolean {
    window.localStorage.removeItem(STORAGE_COACHES_PAGINATION)
    return true
  }
}
