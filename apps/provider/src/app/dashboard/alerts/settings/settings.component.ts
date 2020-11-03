import { Component, OnDestroy, OnInit } from '@angular/core'

import {
  AlertsDatabase,
  AlertTypesDataSource
} from '@app/dashboard/alerts/services'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { OrganizationWithAddress } from '@app/shared/selvera-api'

@Component({
  selector: 'app-alerts-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AlertsSettingsComponent implements OnDestroy, OnInit {
  source: AlertTypesDataSource

  clinic: Partial<OrganizationWithAddress> = {}

  constructor(
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: AlertsDatabase
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
      this.context
    )

    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
