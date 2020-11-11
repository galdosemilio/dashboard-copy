import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ContextService } from '@app/service'
import { CcrPaginator } from '@app/shared'
import {
  PackageDatabase,
  PackageDatasource
} from '@app/shared/components/package-table/services'
import { OrgSingleResponse } from '@coachcare/npm-api'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { CreatePhaseDialog } from '../../dialogs'

@Component({
  selector: 'app-clinic-phases',
  templateUrl: './clinic-phases.component.html',
  styleUrls: ['./clinic-phases.component.scss']
})
export class ClinicPhasesComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginator, { static: true }) paginator: CcrPaginator

  public isAdmin: boolean
  public clinic: OrgSingleResponse
  public source: PackageDatasource

  constructor(
    private context: ContextService,
    private database: PackageDatabase,
    private dialog: MatDialog
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createDatasource()
    this.resolveAdminPerm()
    this.context.clinic$
      .pipe(untilDestroyed(this))
      .subscribe((clinic) => (this.clinic = clinic))
  }

  public onCreatePhase(): void {
    this.dialog
      .open(CreatePhaseDialog, { width: '60vw' })
      .afterClosed()
      .subscribe((refresh) => {
        if (!refresh) {
          return
        }

        this.source.refresh()
      })
  }

  private createDatasource(): void {
    this.source = new PackageDatasource(
      this.context,
      this.database,
      this.paginator
    )
    this.source.addDefault({ organization: this.context.clinic.id })
  }

  private async resolveAdminPerm(): Promise<void> {
    this.isAdmin = await this.context.orgHasPerm(
      this.context.clinic.id,
      'admin'
    )
  }
}
