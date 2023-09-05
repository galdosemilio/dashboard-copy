import { Component, OnInit } from '@angular/core'
import { ContextService, SelectedOrganization } from '@app/service'
import { CSV } from '@coachcare/common/shared'
import { Messaging } from '@coachcare/sdk'
import * as moment from 'moment'
import Papa from 'papaparse'

@Component({
  selector: 'app-reports-custom-message-activity',
  templateUrl: './message-activity.component.html'
})
export class MessageActivityReportComponent implements OnInit {
  public organization: SelectedOrganization

  constructor(private context: ContextService, private messaging: Messaging) {}

  public ngOnInit(): void {
    this.organization = this.context.organization
  }

  public async downloadCSV(): Promise<void> {
    const response = await this.messaging.getActivitySummary({
      organization: this.organization.id,
      createdAt: {
        start: moment().subtract(6, 'months').startOf('month').toISOString(),
        end: moment().endOf('day').toISOString()
      },
      limit: 'all'
    })

    const data = response.data.map((item) => ({
      ID: item.id,
      'ACCOUNT ID': item.account.id,
      'ACCOUNT TYPE': item.account.type,
      'CREATED AT': `${item.createdAt.local.date} ${item.createdAt.local.time}`,
      TIMEZONE: item.createdAt.timezone,
      'ORGANIZATION ID': item.organization.id,
      'ORGANIZATION NAME': item.organization.name,
      ROLE: item.role,
      'THREAD ID': item.thread.id
    }))

    const csv = Papa.unparse(data)

    CSV.toFile({
      filename: `Message Activity - ${this.organization.name} (ID ${this.organization.id})`,
      content: csv
    })
  }
}
