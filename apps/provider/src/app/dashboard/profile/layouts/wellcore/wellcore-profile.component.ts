import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { NotifierService } from '@app/service'
import { ContextService, SelectedAccount } from '@app/service/context.service'
import { Meeting } from '@app/shared/model'
import {
  AccountAddress,
  AddressProvider,
  PackageEnrollment,
  Schedule
} from '@coachcare/sdk'
import { environment } from 'apps/provider/src/environments/environment'
import * as moment from 'moment'

@Component({
  selector: 'app-wellcore-profile',
  templateUrl: './wellcore-profile.component.html',
  styleUrls: ['./wellcore-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WellcoreProfileComponent implements OnInit {
  public account: SelectedAccount
  public address?: AccountAddress
  public canSelfSchedule = false
  public nextMeeting?: Meeting
  public pastMeeting?: Meeting

  constructor(
    private addressProvider: AddressProvider,
    private context: ContextService,
    private notifier: NotifierService,
    private packageEnrollment: PackageEnrollment,
    private schedule: Schedule
  ) {}

  public ngOnInit(): void {
    this.account = this.context.user
    void this.fetchMeetings()
    void this.fetchBillingAddress()
    void this.fetchSelfScheduleStatus()
  }

  private async fetchBillingAddress(): Promise<void> {
    try {
      const {
        data: [billingAddress]
      } = await this.addressProvider.getAddressList({
        account: this.account.id,
        limit: 1
      })

      this.address = billingAddress ?? null
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async fetchMeetings(): Promise<void> {
    try {
      const {
        data: [nextMeeting]
      } = await this.schedule.fetchAllMeeting({
        account: this.account.id,
        limit: 1,
        organization: this.context.organizationId,
        range: {
          start: moment().toISOString(),
          end: moment().add(1, 'year').endOf('year').toISOString()
        }
      })

      const {
        data: [pastMeeting]
      } = await this.schedule.fetchAllMeeting({
        account: this.account.id,
        limit: 1,
        organization: this.context.organizationId,
        range: {
          start: moment().subtract(1, 'year').endOf('year').toISOString(),
          end: moment().toISOString()
        },
        sort: [{ property: 'start', dir: 'desc' }]
      })

      this.nextMeeting = nextMeeting ? new Meeting(nextMeeting) : null
      this.pastMeeting = pastMeeting ? new Meeting(pastMeeting) : null
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async fetchSelfScheduleStatus(): Promise<void> {
    try {
      const packageCheckRes =
        await this.packageEnrollment.checkPackageEnrollment({
          account: this.account.id,
          package: environment.wellcoreEligibleToSelfSchedulePhaseId,
          organization: this.context.organizationId
        })

      this.canSelfSchedule = packageCheckRes.enrolled
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
