import { Component, OnInit } from '@angular/core'
import { ContextService, SelectedOrganization } from '@app/service'
import { CSVUtils } from '@coachcare/common/shared'
import { Messaging } from '@coachcare/sdk'
import * as moment from 'moment'

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

    const separator = ','
    let csv = ''

    csv += `"ID"${separator}`
    csv += `"ACCOUNT ID"${separator}`
    csv += `"ACCOUNT TYPE"${separator}`
    csv += `"CREATED AT"${separator}`
    csv += `"TIMEZONE"${separator}`
    csv += `"ORGANIZATION ID"${separator}`
    csv += `"ORGANIZATION NAME"${separator}`
    csv += `"ROLE"${separator}`
    csv += `"THREAD ID"`
    csv += '\r\n'

    response.data.forEach((item) => {
      csv += `"${item.id}"${separator}`
      csv += `"${item.account.id}"${separator}`
      csv += `"${item.account.type}"${separator}`
      csv += `"${item.createdAt.local.date} ${item.createdAt.local.time}"${separator}`
      csv += `"${item.createdAt.timezone}"${separator}`
      csv += `"${item.organization.id}"${separator}`
      csv += `"${item.organization.name}"${separator}`
      csv += `"${item.role}"${separator}`
      csv += `"${item.thread.id}"`
      csv += '\r\n'
    })

    CSVUtils.generateCSV({
      filename: `Message Activity - ${this.organization.name} (ID ${this.organization.id})`,
      content: csv
    })
  }
}
