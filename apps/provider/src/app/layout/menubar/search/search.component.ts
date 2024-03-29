import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@coachcare/material'
import { Router } from '@angular/router'
import { select, Store } from '@ngrx/store'
import { AccountProvider } from '@coachcare/sdk'

import { CCRConfig } from '@app/config'
import { ContextService, CurrentAccount, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { AccListRequest, AccountAccessData } from '@coachcare/sdk'
import { paletteSelector } from '@app/store/config'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@UntilDestroy()
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
    private account: AccountProvider,
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
          void this.searchAccounts(query)
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
      void this.router.navigate([this.context.getProfileRoute(account)])
    }
  }

  private async searchAccounts(query: string): Promise<void> {
    const request: AccListRequest = {
      query
    }

    try {
      const res = await this.account.getList(request)
      this.accounts = res.data

      if (/^\d+$/.test(query)) {
        const singleAccount = await this.account
          .getSingle(query)
          .then((res) => res)
          .catch(() => null)

        if (
          singleAccount &&
          !this.accounts.find((entry) => entry.id === singleAccount.id)
        ) {
          this.accounts.splice(0, 0, singleAccount)
        }
      }

      if (this.accounts.length > 0) {
        this.trigger.openPanel()
      }
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
