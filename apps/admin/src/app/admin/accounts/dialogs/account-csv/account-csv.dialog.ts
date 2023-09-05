import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AccountFullData,
  AccountTypeIds,
  AccountProvider,
  OrganizationProvider
} from '@coachcare/sdk'
import { OrganizationAutocompleterComponent } from '@coachcare/common/components'
import { NotifierService } from '@coachcare/common/services'
import * as moment from 'moment'
import { CSV } from '@coachcare/common/shared'
import Papa from 'papaparse'

@Component({
  selector: 'ccr-account-csv-dialog',
  templateUrl: './account-csv.dialog.html',
  styleUrls: ['./account-csv.dialog.scss'],
  host: {
    class: 'ccr-dialog ccr-plain'
  }
})
export class AccountCSVDialogComponent implements OnInit {
  @ViewChild(OrganizationAutocompleterComponent, { static: false })
  autocompleter: OrganizationAutocompleterComponent
  public includeAssociations
  excludedOrgs: any[] = []
  isLoading = false

  constructor(
    private account: AccountProvider,
    private notify: NotifierService,
    private organization: OrganizationProvider
  ) {}

  ngOnInit(): void {}

  async downloadCSV() {
    try {
      this.isLoading = true
      const request = {
        exclude: this.excludedOrgs.map((org) => org.id),
        accountType: AccountTypeIds.Provider,
        limit: 'all',
        include: this.includeAssociations
          ? 'organization-association'
          : undefined
      }
      const response = await this.account.getAll(request as any)
      const csv = this.generateCSV(response.data as AccountFullData[])
      const date = moment().format('YYYY-MM-DD')
      const filename = `Provider_List_${date}.csv`

      CSV.toFile({ content: csv, filename })
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async orgSelected(orgId: string) {
    try {
      if (!orgId || this.excludedOrgs.find((org) => org.id === orgId)) {
        return
      }
      this.isLoading = true
      const organization = await this.organization.getSingle(orgId)
      this.excludedOrgs.push(organization)
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
      this.autocompleter.reset()
    }
  }

  removeOrganization(index: number): void {
    this.excludedOrgs.splice(index, 1)
  }

  private generateCSV(accounts: any[]): string {
    let csv = ''

    if (!accounts || !accounts.length) {
      return csv
    }

    csv += 'PROVIDER LIST\r\n'

    const data = accounts.map((account) => {
      const row = {
        ID: account.id || '',
        'FIRST NAME': account.firstName || '',
        'LAST NAME': account.lastName || '',
        EMAIL: account.email || '',
        PHONE: `${account.countryCode || ''}${account.phone || ''}`
      }

      if (this.includeAssociations && account.organization) {
        row['ORGANIZATION'] = account.organization.name
        row['ORGANIZATION ID'] = account.organization.id || ''
      }

      return row
    })

    csv += Papa.unparse(data)

    return csv
  }
}
