import { Component, Inject, OnInit, ViewChild } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  AccountProvider,
  AccListRequest,
  AccListResponse,
  Account,
  AccountAccessData,
  OrganizationEntity,
  OrganizationProvider
} from '@coachcare/sdk'
import { FormControl } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { MatAutocompleteTrigger } from '@coachcare/material'
import { NotifierService } from '@app/service'

export interface CoachSelectDialogProps {
  organizationId: string
}

@Component({
  selector: 'coach-select',
  templateUrl: './coach-select.dialog.html',
  styleUrls: ['./coach-select.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class CoachSelectDialog implements OnInit {
  public accounts: Array<AccountAccessData>
  public searchCtrl: FormControl
  public selectedCoach: Account = undefined
  public selectedOrganization: OrganizationEntity = undefined
  public showWarning = false
  @ViewChild(MatAutocompleteTrigger, { static: false })
  public trigger: MatAutocompleteTrigger

  constructor(
    private account: AccountProvider,
    @Inject(MAT_DIALOG_DATA) public data: CoachSelectDialogProps,
    public dialog: MatDialogRef<CoachSelectDialog>,
    private notifier: NotifierService,
    private organization: OrganizationProvider
  ) {}
  CoachSelectDialogProps
  public ngOnInit(): void {
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

    // get the hierarchy path for the selected clinic, so it can be compared against the selected coach to alert if their is not a shared org path, and subsequently a likely failed attempt to add the coach
    this.organization
      .getSingle(this.data.organizationId)
      .then((clinic) => {
        this.selectedOrganization = clinic
      })
      .catch((err) => {
        console.error(err)
      })
  }

  public select($event: any): void {
    const coach = this.accounts.find((acc) => acc.id === $event.option.value)

    if (!coach) {
      return
    }

    this.selectedCoach = coach

    // get organizations to which this coach account belongs.  Calculate any intersect of this coach's org associations to the select org's hierarchy path.  If the selectionOrganization loaded (is not undefined) AND there is at least one intersection, the account should be addable
    this.account
      .getList({
        account: this.selectedCoach.id
      })
      .then((accounts: AccListResponse) => {
        const accountOrgs = accounts.data[0].organizations.map((e) => e.id)
        this.showWarning = !(
          this.selectedOrganization !== undefined &&
          accountOrgs.some((x) =>
            this.selectedOrganization.hierarchyPath.includes(x)
          )
        )
      })
  }

  public unsetCoach(): void {
    this.selectedCoach = undefined
    this.showWarning = false
    this.searchCtrl.setValue('')
  }

  public save(): void {
    this.dialog.close(this.selectedCoach)
  }

  private searchAccounts(query: string): void {
    const request: AccListRequest = {
      accountType: '2',
      query: query
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
