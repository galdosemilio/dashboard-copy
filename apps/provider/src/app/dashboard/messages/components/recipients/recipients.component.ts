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
import { MatAutocompleteTrigger } from '@coachcare/material'
import {
  AccountAccessData,
  AccountProvider,
  AccSingleResponse
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { MessageRecipient } from '../../model'
import { NotifierService } from '@app/service'

@Component({
  selector: 'messages-recipients',
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

  constructor(
    private account: AccountProvider,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          void this.searchAccounts(query)
        } else if (this.trigger) {
          this.trigger.closePanel()
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
        shortName: `${account.firstName} ${account.lastName[0]}.`,
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

  private async searchAccounts(query: string): Promise<void> {
    try {
      const res = await this.account.getList({ query })
      this.accounts = res.data.filter(
        (a) =>
          a.id !== this.current.id &&
          !this.selected.some((sa) => sa.id === a.id)
      )
      if (this.accounts.length > 0) {
        this.trigger.openPanel()
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
