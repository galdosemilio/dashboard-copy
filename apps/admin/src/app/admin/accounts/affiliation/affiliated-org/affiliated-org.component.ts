import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {
  AffiliationAccountsDataSource,
  GetListSegment
} from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import {
  Affiliation,
  AccountTypeIds,
  CreateOrganizationAssignmentRequest,
  OrganizationAssociation,
  UpdateOrganizationAssociationRequest
} from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { NotifierService } from '@coachcare/common/services'
import { Subject } from 'rxjs'

@Component({
  selector: 'ccr-related-org',
  templateUrl: './affiliated-org.component.html',
  styleUrls: ['./affiliated-org.component.scss'],
  providers: [AffiliationAccountsDataSource]
})
export class AffiliatedOrgComponent implements OnInit {
  columns = ['name', 'actions']
  clientId
  accountType
  accountInfo
  autocompleterAccountType

  @Input() org: GetListSegment

  @ViewChild(CcrPaginatorComponent, { static: false })
  paginator: CcrPaginatorComponent
  refresh$ = new Subject<any>()

  constructor(
    private route: ActivatedRoute,
    private affiliation: Affiliation,
    private organizationAssociation: OrganizationAssociation,
    private notifier: NotifierService,
    public source: AffiliationAccountsDataSource
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.accountType = data.accountType
      this.accountInfo = data.account

      this.autocompleterAccountType =
        this.accountType === AccountTypeIds.Provider
          ? AccountTypeIds.Client
          : AccountTypeIds.Provider

      this.getAssignedAccounts()
    })
  }

  getAssignedAccounts() {
    // setup source
    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))

    this.source.addDefault({
      organization: this.org.id,
      account: this.accountInfo.id,
      accessType: 'assignment'
    } as any) // MERGETODO: CHECK THIS TYPE!!!
  }

  addAssignment() {
    const req: CreateOrganizationAssignmentRequest =
      this.accountType === AccountTypeIds.Provider
        ? {
            organization: this.org.id,
            client: this.clientId,
            provider: this.accountInfo.id
          }
        : {
            organization: this.org.id,
            client: this.accountInfo.id,
            provider: this.clientId
          }

    this.affiliation
      .assign(req)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_UPDATED'))
        this.refresh$.next()
      })
      .catch((err) => this.notifier.error(err))
  }

  accSelected(id: string) {
    this.clientId = id
  }

  removeRecord(id: string) {
    const req: CreateOrganizationAssignmentRequest =
      this.accountType === AccountTypeIds.Provider
        ? {
            organization: this.org.id,
            client: id,
            provider: this.accountInfo.id
          }
        : {
            organization: this.org.id,
            client: this.accountInfo.id,
            provider: id
          }

    this.affiliation
      .unassign(req)
      .then((res) => {
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_UPDATED'))
        this.refresh$.next()
      })
      .catch((err) => this.notifier.error(err))
  }

  onViewAllChange() {
    const req: UpdateOrganizationAssociationRequest = {
      account: this.accountInfo.id,
      organization: this.org.id,
      permissions: {
        viewAll: this.org.permissions ? this.org.permissions.viewAll : false
      }
    }
    this.updateOrganization(req)
  }

  onAdminChange() {
    const req: UpdateOrganizationAssociationRequest = {
      account: this.accountInfo.id,
      organization: this.org.id,
      permissions: {
        admin: this.org.permissions ? this.org.permissions.admin : false
      }
    }
    this.updateOrganization(req)
  }

  onClientPhiChange() {
    const req: UpdateOrganizationAssociationRequest = {
      account: this.accountInfo.id,
      organization: this.org.id,
      permissions: {
        allowClientPhi: this.org.permissions
          ? this.org.permissions.allowClientPhi
          : false
      }
    }
    this.updateOrganization(req)
  }

  updateOrganization(req: UpdateOrganizationAssociationRequest) {
    this.organizationAssociation
      .update(req)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.PERM_UPDATED'))
      })
      .catch((err) => this.notifier.error(err))
  }
}
