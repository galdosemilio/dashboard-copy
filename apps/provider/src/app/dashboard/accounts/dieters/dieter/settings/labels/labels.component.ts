import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { Subject } from 'rxjs'

import { ContextService, NotifierService } from '@app/service'
import { CcrPaginator } from '@app/shared'
import { LabelsDatabase, LabelsDataSource } from '../services'

@Component({
  selector: 'app-dieter-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class DieterLabelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator

  source: LabelsDataSource
  param$ = new Subject<any>()

  clinics = [] // available options
  clinic // selected value

  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360019702272-Editing-a-Patient-Profile'

  constructor(
    private notifier: NotifierService,
    private database: LabelsDatabase,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.source = new LabelsDataSource(
      this.notifier,
      this.database,
      this.paginator
    )

    this.source.addRequired(this.param$, () => ({
      organization: this.clinic,
      active: true
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
