import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import { AccountParams } from '@board/services'
import {
  GetListSegment,
  OrganizationsDataSource
} from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import {
  Affiliation,
  AccountSingle,
  AccountTypeId,
  CreateOrganizationAssociationRequest,
  DeleteOrganizationAssociationRequest
} from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import {
  OrganizationAutocompleterComponent,
  CcrPaginatorComponent
} from '@coachcare/common/components'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'
import { NotifierService } from '@coachcare/common/services'
import { Subject } from 'rxjs'

@Component({
  selector: 'ccr-affiliation',
  templateUrl: './affiliation.component.html',
  styleUrls: ['./affiliation.component.scss'],
  providers: [OrganizationsDataSource],
  encapsulation: ViewEncapsulation.None
})
export class AffiliationComponent implements OnInit {
  @ViewChild(OrganizationAutocompleterComponent, { static: true })
  autocompleter: OrganizationAutocompleterComponent
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  accountType: AccountTypeId
  account: AccountSingle
  org: string
  data: Array<GetListSegment>

  refresh$ = new Subject<void>()

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private affiliation: Affiliation,
    private notifier: NotifierService,
    public source: OrganizationsDataSource
  ) {}

  ngOnInit() {
    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))

    // setup source
    this.source.addRequired(this.refresh$, () => ({
      user: this.account.id,
      strict: true
    }))

    this.source.connect().subscribe((data) => (this.data = data))

    this.route.data.subscribe((data: AccountParams) => {
      this.accountType = data.accountType
      this.account = data.account as AccountSingle

      this.refresh$.next()
    })
  }

  orgSelected(id: string) {
    this.org = id
  }

  associate() {
    const req: CreateOrganizationAssociationRequest = {
      organization: this.org,
      account: this.account.id
    }
    this.affiliation
      .associate(req)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_UPDATED'))
        this.autocompleter.reset()
        this.source.refresh({ offset: 0 })
      })
      .catch((err) => this.notifier.error(err))
  }

  dissociate(org: GetListSegment): void {
    const data: PromptDialogData = {
      title: _('PROMPT.ORGS.DISOCCIATE'),
      content: _('PROMPT.ORGS.DISOCCIATE_PROMPT'),
      contentParams: { item: `${org.name}` }
    }
    this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          const req: DeleteOrganizationAssociationRequest = {
            account: this.account.id,
            organization: org.id
          }
          this.affiliation
            .disassociate(req)
            .then(() => {
              this.notifier.success(_('NOTIFY.SUCCESS.ORG_DISOCCIATED'))
              this.source.refresh({ offset: 0 })
            })
            .catch((err) => this.notifier.error(err))
        }
      })
  }
}
