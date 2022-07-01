import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  AlertsDatabase,
  AlertTypesDataSource
} from '@app/dashboard/alerts/services'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { AppState } from '@app/store/state'
import { OrganizationWithAddress } from '@coachcare/sdk'
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-alerts-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AlertsSettingsComponent implements OnDestroy, OnInit {
  source: AlertTypesDataSource

  clinic: Partial<OrganizationWithAddress> = {}
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020232251-Setting-up-Patient-Alerts'

  constructor(
    private context: ContextService,
    private bus: EventsService,
    private database: AlertsDatabase,
    private notifier: NotifierService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')

    this.context.organization$.subscribe(() => {
      this.clinic = { name: this.context.organization.name }
    })

    this.source = new AlertTypesDataSource(
      this.notifier,
      this.database,
      this.context,
      this.store
    )

    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
