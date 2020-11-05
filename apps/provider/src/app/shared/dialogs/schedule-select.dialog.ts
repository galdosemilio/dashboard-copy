import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MatAutocompleteTrigger,
  MatDialogRef
} from '@coachcare/common/material'
import { select, Store } from '@ngrx/store'
import { Account } from '@coachcare/npm-api'

import { CCRConfig } from '@app/config'
import { ConfigService, NotifierService } from '@app/service'
import { AccListRequest, AccountAccessData, Profile } from '@coachcare/npm-api'
import { paletteSelector } from '@app/store/config'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'app-schedule-select-dialog',
  templateUrl: 'schedule-select.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class ScheduleSelectDialog implements OnInit {
  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger
  public searchCtrl: FormControl
  public accounts: Array<AccountAccessData>
  public onlyProviders: boolean
  public fill: string

  constructor(
    private store: Store<CCRConfig>,
    private account: Account,
    private dialogRef: MatDialogRef<ScheduleSelectDialog>,
    private config: ConfigService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      user: Profile
      organization: string
      title: string
      button: string
      onlyProviders?: boolean
    }
  ) {
    this.store
      .pipe(select(paletteSelector))
      .subscribe((palette) => (this.fill = palette.base))
  }

  ngOnInit() {
    this.onlyProviders = this.data.onlyProviders || false

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

  public selectDefault() {
    this.dialogRef.close(this.data.user)
  }

  public select(account: AccountAccessData): void {
    this.dialogRef.close(account)
  }

  private searchAccounts(query: string): void {
    const request: AccListRequest = {
      query: query,
      organization: this.data.organization,
      accountType: this.onlyProviders ? '2' : undefined
      // TODO use AccountTypeId.Provider
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
