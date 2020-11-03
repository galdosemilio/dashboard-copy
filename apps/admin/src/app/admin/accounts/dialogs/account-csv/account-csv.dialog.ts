import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AccountFullData,
  AccountTypeIds,
  Account,
  Organization
} from '@coachcare/npm-api'
import { OrganizationAutocompleterComponent } from '@coachcare/common/components'
import { NotifierService } from '@coachcare/common/services'
import * as moment from 'moment'

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
  excludedOrgs: any[] = []
  isLoading = false

  constructor(
    private account: Account,
    private notify: NotifierService,
    private organization: Organization
  ) {}

  ngOnInit(): void {}

  async downloadCSV() {
    try {
      this.isLoading = true
      const response = await this.account.getAll({
        exclude: this.excludedOrgs.map((org) => org.id),
        accountType: AccountTypeIds.Provider,
        limit: 'all'
      } as any)

      const csv = this.generateCSV(response.data as AccountFullData[])
      const date = moment().format('YYYY-MM-DD')
      const filename = `Provider_List_${date}.csv`

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
    const separator = ','

    if (!accounts || !accounts.length) {
      return csv
    }

    csv += 'PROVIDER LIST\r\n'
    csv += `"ID"${separator}`
    csv += `"FIRST NAME"${separator}`
    csv += `"LAST NAME"${separator}`
    csv += `"EMAIL"${separator}`
    csv += `"PHONE"\r\n`

    accounts.forEach((account: any) => {
      csv += `"${account.id || ''}"${separator}`
      csv += `"${account.firstName || ''}"${separator}`
      csv += `"${account.lastName || ''}"${separator}`
      csv += `"${account.email || ''}"${separator}`
      csv += `"${account.countryCode || ''}${account.phone || ''}"\r\n`
    })

    return csv
  }
}
