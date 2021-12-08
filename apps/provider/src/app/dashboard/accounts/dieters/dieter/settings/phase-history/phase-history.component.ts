import { Component, OnInit, ViewChild } from '@angular/core'
import { PhaseEnrollmentDatabase, PhaseEnrollmentDataSource } from '../services'
import { ContextService } from '@app/service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { PackageEnrollmentSegment } from '@coachcare/sdk'
import { CcrPaginatorComponent } from '@coachcare/common/components'

@UntilDestroy()
@Component({
  selector: 'app-dieter-phase-history',
  templateUrl: './phase-history.component.html',
  styleUrls: ['./phase-history.component.scss']
})
export class DieterPhaseHistoryComponent implements OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public result: PackageEnrollmentSegment[] = []
  public source: PhaseEnrollmentDataSource

  constructor(
    private context: ContextService,
    private database: PhaseEnrollmentDatabase
  ) {}

  public ngOnInit(): void {
    this.source = new PhaseEnrollmentDataSource(this.database, this.paginator)

    this.source.addDefault({
      organization: this.context.organizationId,
      account: this.context.accountId
    })

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((result) => (this.result = result))
  }
}
