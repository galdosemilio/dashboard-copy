import { Component, OnInit } from '@angular/core'
import { NotifierService } from '@coachcare/common/services'
import * as moment from 'moment'
import {
  OrganizationActivityAggregate,
  OrganizationActivityRequest,
  Reports
} from '@coachcare/sdk'
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'ccr-report-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ReportsListComponent implements OnInit {
  private env: string = environment.ccrApiEnv
  private startDate: string = moment().subtract(30, 'days').format('YYYY-MM-DD')
  private endDate: string = moment().format('YYYY-MM-DD')
  private orgActivityRequest: OrganizationActivityRequest = {
    organization: this.env === 'prod' ? '3637' : '30',
    startDate: this.startDate,
    endDate: this.endDate,
    detailed: true,
    limit: 'all',
    unit: 'month'
  }
  public isLoading = false

  constructor(private notify: NotifierService, private reports: Reports) {}

  ngOnInit() {}

  public async downloadReport(report: 'inactiveClinics'): Promise<void> {
    try {
      this.isLoading = true
      const response = await this.reports.fetchOrganizationActivity(
        this.orgActivityRequest
      )

      const csv = this.generateCSV(response as OrganizationActivityAggregate[])
      const filename = `Inactive_Clinics_${this.startDate}_to_${this.endDate}.csv`

      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private generateCSV(orgs: any[]): string {
    let csv = ''
    const separator = ','

    if (!orgs || !orgs.length) {
      return csv
    }

    csv += `"Organization ID"${separator}`
    csv += `"Organization Name"${separator}`
    csv += `"Organization Hierarchy"${separator}`
    csv += `"Providers Total"${separator}`
    csv += `"Providers Active Count"${separator}`
    csv += `"Providers Active Percentage"${separator}`
    csv += `"Clients Total"${separator}`
    csv += `"Clients Active Count"${separator}`
    csv += `"Clients Active Percentage"\r\n`

    orgs.forEach((entry: OrganizationActivityAggregate) => {
      csv += `"${entry.organization.id || ''}"${separator}`
      csv += `"${entry.organization.name || ''}"${separator}`
      csv += `"${entry.organization.hierarchyPath || ''}"${separator}`
      csv += `"${entry.providers.total || '0'}"${separator}`
      csv += `"${entry.providers.active || '0'}"${separator}`
      csv += `"${
        this.generatePercent(entry.providers.active, entry.providers.total) ||
        '0'
      }"${separator}`
      csv += `"${entry.clients.total || '0'}"${separator}`
      csv += `"${entry.clients.active || '0'}"${separator}`
      csv += `"${
        this.generatePercent(entry.clients.active, entry.clients.total) || '0'
      }"\r\n`
    })

    return csv
  }

  private generatePercent(numerator: number, denominator: number): string {
    const percent: string = (numerator / denominator).toFixed(3)
    return percent === 'NaN' ? '0.000' : percent
  }
}
