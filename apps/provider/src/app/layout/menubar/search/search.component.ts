import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@coachcare/common/material'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { Account } from '@coachcare/npm-api'

import { CCRConfig } from '@app/config'
import { ContextService, CurrentAccount, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { AccListRequest, AccountAccessData } from '@coachcare/npm-api'
import { paletteSelector } from '@app/store/config'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnDestroy, OnInit {
  @Input()
  public fill

  @ViewChild(MatAutocompleteTrigger, { static: false })
  public trigger: MatAutocompleteTrigger

  public accounts: Array<AccountAccessData>
  public admin = false
  public canAccessPhi = false
  public currentAccount: CurrentAccount
  public searchCtrl: FormControl
  public viewAll = false

  constructor(
    private router: Router,
    private store: Store<CCRConfig>,
    private account: Account,
    private context: ContextService,
    private notifier: NotifierService
  ) {
    this.store
      .pipe(select(paletteSelector))
      .subscribe((palette) => (this.fill = palette.contrast))
  }

  public ngOnInit() {
    this.currentAccount = this.context.user
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          this.searchAccounts(query)
        } else {
          this.trigger.closePanel()
        }
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.canAccessPhi =
        org && org.permissions ? org.permissions.allowClientPhi : false
      this.viewAll = org && org.permissions ? org.permissions.viewAll : false
      this.admin = org && org.permissions ? org.permissions.admin : false
    })
  }

  public ngOnDestroy() {}

  public formatAccountType(accountType: any) {
    let result
    if ([2, '2', 'provider'].indexOf(accountType.id) >= 0) {
      result = _('GLOBAL.COACH')
    } else if ([3, '3', 'client'].indexOf(accountType.id) >= 0) {
      result = _('GLOBAL.PATIENT')
    }
    return result ? result : ''
  }

  public select(account: AccountAccessData): void {
    if (
      account.id === this.context.user.id ||
      (account.accountType.id === '3' && this.canAccessPhi) ||
      (account.accountType.id === '2' && this.admin)
    ) {
      this.accounts = []
      this.router.navigate([this.context.getProfileRoute(account)])
    }
  }

  private searchAccounts(query: string): void {
    const request: AccListRequest = {
      query
    }
    this.account
      .getList(request)
      .then((res) => {
        this.accounts = res.data
        if (this.accounts.length > 0) {
          this.trigger.openPanel()
        }
      })
      .catch((err) => this.notifier.error(err))
  }
}
