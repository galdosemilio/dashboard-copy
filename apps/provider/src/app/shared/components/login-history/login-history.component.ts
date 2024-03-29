import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { ContextService, SelectedOrganization } from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { LoginHistoryDatabase, LoginHistoryDataSource } from './services'

@UntilDestroy()
@Component({
  selector: 'ccr-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnDestroy, OnInit {
  @Input() account?: string
  @Input() patientMode = false

  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public columns: string[] = ['createdAt', 'organization']
  public organization: SelectedOrganization
  public shownColumns: string[] = this.columns.slice()
  public source: LoginHistoryDataSource

  constructor(
    private context: ContextService,
    private database: LoginHistoryDatabase
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createDataSource()

    this.organization = this.context.organization

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((org) => (this.organization = org))

    this.refreshShownColumns()
  }

  private createDataSource(): void {
    this.source = new LoginHistoryDataSource(this.database, this.paginator)

    if (this.account) {
      this.source.addDefault({ account: this.account })
    } else {
      this.source.addRequired(this.context.account$, () => ({
        account: this.context.accountId
      }))
    }

    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))
  }

  private refreshShownColumns(): void {
    this.shownColumns = this.columns.slice()

    if (!this.patientMode) {
      this.shownColumns = this.shownColumns.filter(
        (col) => col !== 'organization'
      )
    }
  }
}
