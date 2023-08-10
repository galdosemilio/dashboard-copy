import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { ContextService } from '@app/service'
import {
  UpcomingTransition,
  UpcomingTransitionsDatabase,
  UpcomingTransitionsDataSource
} from '../../../dieters/dieter/settings/services/upcoming-transitions'
import { TriggerDetailDialogProps } from '../trigger-detail.dialog'
import { CcrPaginatorComponent } from '@coachcare/common/components'

@Component({
  selector: 'app-upcoming-table',
  templateUrl: './upcoming-table.component.html'
})
export class UpcomingTableComponent implements OnInit {
  @Input() data: TriggerDetailDialogProps
  @ViewChild(CcrPaginatorComponent, { static: true }) paginator

  columns: string[] = ['type', 'createdAt', 'createdAtHour', 'content']
  source: UpcomingTransitionsDataSource
  rows: UpcomingTransition[] = []

  constructor(
    private context: ContextService,
    private database: UpcomingTransitionsDatabase
  ) {}

  ngOnInit(): void {
    this.createSource()
    this.resolveData()
    this.source.connect().subscribe((rows) => {
      this.rows = rows.filter(
        (item: UpcomingTransition) => item.triggers.length > 0
      )
    })
  }

  private createSource(): void {
    this.source = new UpcomingTransitionsDataSource(
      this.database,
      this.paginator
    )

    this.source.addDefault({
      account: this.context.accountId,
      organization: this.context.organizationId
    })
  }

  private resolveData(): void {
    if (this.data.sequence) {
      this.source.addDefault({ sequence: this.data.sequence.id })
    }

    if (this.data.enrollment) {
      this.source.addDefault({
        account: this.data.enrollment.account.id,
        sequence: this.data.enrollment.sequence.id
      })
    }
  }
}
