import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { Sequence } from '@app/dashboard/sequencing/models'
import { ContextService } from '@app/service'
import {
  GetAllSeqEnrollmentsResponse,
  TriggerHistoryItem
} from '@coachcare/sdk'
import {
  TriggerHistoryDatabase,
  TriggerHistoryDataSource
} from '../../../dieters/dieter/settings/services/trigger-history'

interface TriggerDetailDialogProps {
  enrollment: GetAllSeqEnrollmentsResponse
  sequence: Sequence
}

@Component({
  selector: 'app-previous-table',
  templateUrl: './previous-table.component.html'
})
export class PreviousTableComponent implements OnInit {
  @Input() data: TriggerDetailDialogProps
  @ViewChild(MatPaginator, { static: false }) paginator

  columns: string[] = ['type', 'createdAt', 'createdAtHour', 'content']
  source: TriggerHistoryDataSource
  rows: TriggerHistoryItem[]

  constructor(
    private context: ContextService,
    private database: TriggerHistoryDatabase
  ) {}

  ngOnInit(): void {
    this.createSource()
    this.resolveData()
    this.source.connect().subscribe((rows) => {
      this.rows = rows.filter((item) => item.trigger)
    })
  }

  private createSource(): void {
    this.source = new TriggerHistoryDataSource(this.database, this.paginator)

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
