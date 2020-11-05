import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import {
  SupplementDatabase,
  SupplementDataSource
} from '@app/dashboard/accounts/dieters/services'
import { ContextService, NotifierService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import { FetchSupplementsSegment } from '@coachcare/npm-api'

@Component({
  selector: 'app-dieter-journal-supplements',
  templateUrl: 'supplements.component.html'
})
export class SupplementsComponent implements OnInit, OnDestroy {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date = dates
    this.updateSelector()
  }

  source: SupplementDataSource
  param$ = new BehaviorSubject<any>({})

  date: DateNavigatorOutput = {}
  supplements: Array<FetchSupplementsSegment>

  clinics = [] // available options
  clinic // selected value

  constructor(
    private context: ContextService,
    private notifier: NotifierService,
    private database: SupplementDatabase
  ) {}

  ngOnInit(): void {
    // FIXME ensure single connection to source
    // TODO move controls to ngrx
    // source setup
    this.source = new SupplementDataSource(this.notifier, this.database)
    this.source.addDefault({
      account: this.context.accountId,
      unit: 'day'
    })
    this.source.addRequired(this.param$, () => this.param$.getValue())

    // shared organizations
    const orgs = this.context.accountOrgs

    this.clinics = orgs.map((c) => ({
      value: c.id,
      viewValue: c.name
    }))
    this.clinic =
      this.context.accountOrg &&
      orgs.some((o) => o.id === this.context.accountOrg)
        ? this.context.accountOrg
        : this.clinics.length
        ? this.clinics[0].value
        : null

    this.selectClinic(this.clinic)
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  selectClinic(value) {
    this.clinic = value
    this.updateSelector()
  }

  updateSelector() {
    if (this.clinic && this.date) {
      this.param$.next({
        organization: this.clinic,
        startDate: this.date.startDate,
        endDate: this.date.endDate
      })
    }
  }
}
