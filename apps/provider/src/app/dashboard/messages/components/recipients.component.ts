import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@coachcare/common/material'
import { Account, Messaging } from 'selvera-api'

import { MessageRecipient } from '@app/shared'
import { AccountAccessData, AccSingleResponse } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'app-messages-recipients',
  templateUrl: 'recipients.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MessagesRecipientsComponent implements OnInit {
  @Input()
  current: AccSingleResponse
  @Input()
  total: number

  @Output()
  changed = new EventEmitter<MessageRecipient[]>()

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  public searchCtrl: FormControl
  public accounts: Array<AccountAccessData>
  public selected: Array<MessageRecipient> = []

  constructor(private account: Account, private messaging: Messaging) {}

  ngOnInit() {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          this.searchAccounts(query)
        } else {
          if (this.trigger) {
            this.trigger.closePanel()
          }
        }
      })
  }

  formatAccountType(accountType) {
    let result
    if ([2, '2', 'provider'].indexOf(accountType) >= 0) {
      result = _('GLOBAL.COACH')
    } else if ([3, '3', 'client'].indexOf(accountType) >= 0) {
      result = _('GLOBAL.PATIENT')
    }
    return result || ''
  }

  selectAccount(account: AccountAccessData): void {
    if (
      !this.selected.some((a) => a.id === account.id) &&
      account.id !== this.current.id
    ) {
      this.selected.push({
        id: account.id,
        name: `${account.firstName} ${account.lastName}`,
        firstName: account.firstName,
        lastName: account.lastName,
        accountType: account.accountType.id
      })
      this.emitChanged()
    }
    this.accounts = []
  }

  removeAccount(account: AccountAccessData): void {
    this.selected = this.selected.filter((a) => a.id !== account.id)
    this.emitChanged()
  }

  private emitChanged() {
    this.changed.emit(this.selected)
  }

  private searchAccounts(query: string): void {
    this.account.getList({ query }).then((res) => {
      this.accounts = res.data.filter(
        (a) =>
          a.id !== this.current.id &&
          !this.selected.some((sa) => sa.id === a.id)
      )
      if (this.accounts.length > 0) {
        this.trigger.openPanel()
      }
    })
  }
}
