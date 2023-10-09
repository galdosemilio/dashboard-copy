import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { Subject } from 'rxjs'

import { ContextService, NotifierService } from '@app/service'
import { PhasesDatabase, PhasesDataSource } from './services'
import { CcrPaginatorComponent } from '@coachcare/common/components'

@Component({
  selector: 'app-account-phase-list',
  templateUrl: './account-phase-list.component.html'
})
export class AccountPhaseListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  source: PhasesDataSource
  param$ = new Subject<void>()

  clinics = [] // available options
  clinic // selected value

  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360043753631-What-are-Phases-'

  constructor(
    private notifier: NotifierService,
    private database: PhasesDatabase,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.source = new PhasesDataSource(
      this.notifier,
      this.database,
      this.paginator
    )

    this.source.addRequired(this.param$, () => ({
      organization: this.clinic
    }))

    // shared organizations
    const orgs = this.context.accountOrgs

    this.clinics = orgs.map((c) => ({
      value: c.id,
      viewValue: c.name
    }))
    this.clinic =
      this.context.organizationId &&
      orgs.some((o) => o.id === this.context.organizationId)
        ? this.context.organizationId
        : this.clinics.length
        ? this.clinics[0].value
        : null
  }

  ngAfterViewInit() {
    this.selectClinic(this.clinic)
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  selectClinic(value) {
    this.clinic = value
    this.param$.next()
  }
}
