import { Component, OnInit } from '@angular/core'
import { NotifierService } from '@coachcare/common/services'
import * as moment from 'moment'
import {
  OrganizationActivityAggregate,
  OrganizationActivityRequest,
  Reports
} from '@coachcare/sdk'
import { environment } from '../../../../../environments/environment'
import { CSV } from '@coachcare/common/shared'
import Papa from 'papaparse'

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

      CSV.toFile({ content: csv, filename })
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private generateCSV(orgs: any[]): string {
    if (!orgs || !orgs.length) {
      return ''
    }

    const data = orgs.map((entry: OrganizationActivityAggregate) => ({
      'Organization ID': entry.organization.id || '',
      'Organization Name': entry.organization.name || '',
      'Organization Hierarchy': entry.organization.hierarchyPath || '',
      'Providers Total': entry.providers.total || '0',
      'Providers Active Count': entry.providers.active || '0',
      'Providers Active Percentage':
        this.generatePercent(entry.providers.active, entry.providers.total) ||
        '0',
      'Clients Total': entry.clients.total || '0',
      'Clients Active Count': entry.clients.active || '0',
      'Clients Active Percentage':
        this.generatePercent(entry.clients.active, entry.clients.total) || '0'
    }))

    return Papa.unparse(data)
  }

  private generatePercent(numerator: number, denominator: number): string {
    const percent: string = (numerator / denominator).toFixed(3)
    return percent === 'NaN' ? '0.000' : percent
  }
}
