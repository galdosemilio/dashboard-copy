import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { PhaseEnrollmentDatabase, PhaseEnrollmentDataSource } from '../services'
import { ContextService } from '@app/service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { EnrollmentSort, PackageEnrollmentSegment } from '@coachcare/sdk'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { CcrTableSortDirective } from '@app/shared'

@UntilDestroy()
@Component({
  selector: 'app-dieter-phase-history',
  templateUrl: './phase-history.component.html',
  styleUrls: ['./phase-history.component.scss']
})
export class DieterPhaseHistoryComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  @ViewChild(CcrTableSortDirective, { static: true })
  sort: CcrTableSortDirective

  public result: PackageEnrollmentSegment[] = []
  public source: PhaseEnrollmentDataSource

  constructor(
    private context: ContextService,
    private database: PhaseEnrollmentDatabase
  ) {}

  public ngOnDestroy(): void {
    this.source.unsetSorter()
  }

  public ngOnInit(): void {
    this.source = new PhaseEnrollmentDataSource(this.database, this.paginator)

    this.source.addDefault({
      organization: this.context.organizationId,
      account: this.context.accountId
    })

    this.source.setSorter(this.sort, () => ({
      sort: this.sort.direction
        ? [
            {
              property: this.sort.active || 'enrollStart',
              dir: this.sort.direction || 'desc'
            } as EnrollmentSort
          ]
        : [
            {
              property: 'enrollStart',
              dir: 'desc'
            }
          ]
    }))

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((result) => (this.result = result))
  }
}
