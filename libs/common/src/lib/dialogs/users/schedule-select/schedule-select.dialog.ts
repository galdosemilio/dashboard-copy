import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatAutocompleteTrigger,
  MatDialogRef,
} from '@coachcare/common/material';
import {
  Account,
  AccountAccessData,
  AccountTypeIds,
  Organization,
  OrgListSegment,
} from '@coachcare/backend/services';
import { ConfigService, NotifierService } from '@coachcare/common/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ScheduleSelectData } from './schedule-select-data.interface';

@Component({
  selector: 'ccr-schedule-select-dialog',
  templateUrl: 'schedule-select.dialog.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ccr-dialog',
  },
})
export class ScheduleSelectDialog implements OnInit {
  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger;

  searchCtrl: FormControl;
  accounts: Array<AccountAccessData> = [];
  clinics: Array<OrgListSegment> = [];
  selectedClinic: OrgListSegment;
  isLoading = true;
  onlyProviders = false;
  fill: string;

  constructor(
    private account: Account,
    private dialogRef: MatDialogRef<ScheduleSelectDialog>,
    private organization: Organization,
    private config: ConfigService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleSelectData
  ) {
    this.fill = this.config.get('palette.base');
  }

  ngOnInit() {
    this.onlyProviders = this.data.onlyProviders || false;

    this.searchCtrl = new FormControl();
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          this.searchAccounts(query);
        } else {
          if (this.trigger) {
            this.trigger.closePanel();
          }
        }
      });

    this.organization
      .getList({ account: this.data.user.id })
      .then((res) => {
        this.clinics = res.data.filter(
          (c) => c.permissions && c.permissions.admin
        );
        if (this.clinics.length > 0) {
          this.selectedClinic = this.clinics[0];
        }
        this.isLoading = false;
      })
      .catch((err) => this.notifier.error(err));
  }

  selectDefault() {
    if (this.dialogRef) {
      this.dialogRef.close(this.data.user);
    }
  }

  selectOne(account: AccountAccessData): void {
    if (this.dialogRef) {
      this.dialogRef.close(account);
    }
  }

  private searchAccounts(query: string): void {
    const promises: Array<Promise<any>> = [];

    promises.push(
      this.account.getList({
        query,
        accountType: AccountTypeIds.Provider,
        organization: this.selectedClinic.organization.id,
      })
    );

    if (!this.onlyProviders) {
      promises.push(
        this.account.getList({
          query,
          accountType: AccountTypeIds.Client,
          organization: this.selectedClinic.organization.id,
        })
      );
    }

    Promise.all(promises)
      .then((results) => {
        this.accounts = [];
        results.forEach((res) => {
          this.accounts = this.accounts.concat(res.accounts);
        });
        if (this.accounts.length > 0) {
          this.trigger.openPanel();
        }
      })
      .catch((err) => this.notifier.error(err));
  }
}
