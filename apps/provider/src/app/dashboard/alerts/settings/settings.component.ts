import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import {
  AlertsDatabase,
  AlertTypesDataSource
} from '@app/dashboard/alerts/services'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { AppState } from '@app/store/state'
import { OrganizationWithAddress } from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { DeviceDetectorService } from 'ngx-device-detector'
import { filter } from 'rxjs/operators'
import { AlertDataThresholdDialog } from '../dialogs'

@Component({
  selector: 'app-alerts-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class AlertsSettingsComponent implements OnDestroy, OnInit {
  public clinic: Partial<OrganizationWithAddress> = {}
  public source: AlertTypesDataSource

  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020232251-Setting-up-Patient-Alerts'

  constructor(
    private context: ContextService,
    private bus: EventsService,
    private database: AlertsDatabase,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private store: Store<AppState>
  ) {}

  public ngOnInit(): void {
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

  public ngOnDestroy(): void {
    this.source.disconnect()
  }

  public openAlertDialog(): void {
    this.dialog
      .open(AlertDataThresholdDialog, {
        data: {
          preference: null,
          mode: 'create'
        },
        width: !this.deviceDetector.isMobile() ? '60vw' : undefined
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }
}
