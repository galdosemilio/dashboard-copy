import { Component, Input, OnInit, Output, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { AccountAccessData } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { AccountProvider } from '@coachcare/npm-api'

@Component({
  selector: 'ccr-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  @Input()
  excludes: any[] = []
  @Input()
  label = ''
  @Input()
  type: string
  @Input()
  organization: string
  @Input()
  allowSelf = false

  @Output()
  select: Subject<any> = new Subject<any>()

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  accounts: AccountAccessData[] = []
  searchCtrl: FormControl
  translations: any

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private notify: NotifierService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initTranslations()
    this.setupAutocomplete()
  }

  formatAccountType(accountType): void {
    let result
    if ([2, '2', 'provider'].indexOf(accountType) >= 0) {
      result = this.translations['GLOBAL.COACH']
    } else if ([3, '3', 'client'].indexOf(accountType) >= 0) {
      result = this.translations['GLOBAL.PATIENT']
    }
    return result ? result : ''
  }

  onSelectAccount(account): void {
    if (account && account.id) {
      this.select.next(account)
    }
  }

  setupAutocomplete(): void {
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
  }

  searchAccounts(query: string): void {
    this.account
      .getList({
        query,
        accountType: this.type,
        organization: this.organization || undefined
      })
      .then((res) => {
        this.accounts = res.data.filter(
          (a) => !this.excludes.some((sa) => sa.id === a.id)
        )

        if (!this.allowSelf) {
          this.accounts = this.accounts.filter(
            (acc) => acc.id !== this.context.user.id
          )
        }

        if (this.accounts.length > 0) {
          this.trigger.openPanel()
        }
      })
      .catch((err) => this.notify.error(err))
  }

  private initTranslations() {
    this.translate
      .get([_('GLOBAL.COACH'), _('GLOBAL.PATIENT')])
      .subscribe((translations) => (this.translations = translations))
  }
}
