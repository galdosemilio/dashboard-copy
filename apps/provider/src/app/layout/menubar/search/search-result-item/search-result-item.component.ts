import { Component, Input } from '@angular/core'

import { _ } from '@app/shared'
import { AccountAccessData } from '@app/shared/selvera-api'

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html'
})
export class SearchResultItemComponent {
  @Input()
  public account: AccountAccessData
  @Input()
  public canAccessPatient: boolean
  @Input()
  public canCall = true

  public formatAccountType(accountType) {
    let result
    if ([2, '2', 'provider'].indexOf(accountType) >= 0) {
      result = _('GLOBAL.COACH')
    } else if ([3, '3', 'client'].indexOf(accountType) >= 0) {
      result = _('GLOBAL.PATIENT')
    }
    return result || ''
  }
}
