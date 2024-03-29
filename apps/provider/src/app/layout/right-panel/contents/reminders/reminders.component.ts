import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { resolveConfig } from '@app/config/section'
import {
  AlertsDatabase,
  AlertTypesDataSource,
  AlertTypesPreference
} from '@app/dashboard'
import { AlertNotification as CcrAlertNotification } from '@app/dashboard/alerts/models'
import {
  AddDaysheetDialog,
  AddNoteDialog
} from '@app/layout/right-panel/dialogs'
import { NotificationsDataService } from '@app/layout/right-panel/services'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { _, TranslationsObject, unitConversion, unitLabel } from '@app/shared'
import {
  AccountTypeIds,
  AlertNotification,
  AlertsGenericPayload,
  AlertsWeightRegainedPayload,
  FetchAllMeetingRequest,
  NotificationRequest
} from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import { find } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { filter, first } from 'rxjs/operators'
import { Alerts } from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { AppState } from '@app/store/state'

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit, OnDestroy {
  public alerts = []
  public alertsCollapsed?: boolean
  public dateSections: Array<any> = []
  public isLoading = true
  public isScheduleEnabled = false
  public notesCollapsed?: boolean
  public notesRefresh$: Subject<string> = new Subject<string>()
  public phasesCollapsed?: boolean
  public shouldShowDaysheetButton = false
  public shouldShowNotes = true
  public shouldShowPhaseEnrollments = false

  private alertTypes: AlertTypesPreference[] = []
  private formId: string
  private i18n: TranslationsObject

  constructor(
    private alert: Alerts,
    private alertsDatabase: AlertsDatabase,
    private config: ConfigService,
    private context: ContextService,
    private dataService: NotificationsDataService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private store: Store<AppState>,
    private translator: TranslateService
  ) {
    this.translate()
    this.translator.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.translate)
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.formId = resolveConfig('RIGHT_PANEL.REMINDERS_FORM', organization)

        void this.context
          .orgHasScheduleEnabled(AccountTypeIds.Provider)
          .then((enabled) => {
            if (enabled) {
              this.getMeetings()
            } else {
              this.dateSections = []
              this.isLoading = false
            }
          })

        const showReminders = resolveConfig(
          'RIGHT_PANEL.SHOW_REMINDERS',
          organization
        )
        this.shouldShowNotes = !!showReminders

        const shouldShowDaysheetButton = resolveConfig(
          'RIGHT_PANEL.SHOW_DAYSHEET_BUTTON',
          organization
        )
        this.shouldShowDaysheetButton = !!shouldShowDaysheetButton
      })
    void this.getAlerts()
  }

  public showDaysheetDialog(): void {
    this.dialog.open(AddDaysheetDialog, {
      width: '400px',
      disableClose: true
    })
  }

  public showNoteDialog(): void {
    const dialog = this.dialog.open(AddNoteDialog, {
      width: '530px',
      disableClose: true,
      data: {
        accountType: 'dieter',
        formId: this.formId
      }
    })
    dialog
      .afterClosed()
      .pipe(filter((submissionId) => submissionId))
      .subscribe((submissionId) => this.notesRefresh$.next(submissionId))
  }

  translate() {
    this.translator
      .get([_('UNIT.KG'), _('UNIT.LB'), _('UNIT.LBS')])
      .subscribe((translations) => (this.i18n = translations))
  }

  private async fetchAlertTypes(): Promise<void> {
    try {
      const source = new AlertTypesDataSource(
        this.notifier,
        this.alertsDatabase,
        this.context,
        this.store
      )
      source.addDefault({
        organization: this.context.organizationId,
        limit: 'all'
      })
      this.alertTypes = await source.connect().pipe(first()).toPromise()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private getMeetings(): void {
    const request: FetchAllMeetingRequest = {
      organization: this.context.organizationId,
      account: this.context.accountId,
      range: {
        start: moment().toISOString(),
        end: moment().endOf('year').toISOString()
      }
    }
    this.dataService
      .getMeetings(request)
      .then((res) => {
        this.dateSections = this.dataService.groupByDate(
          res,
          'LL',
          this.config.get('app.limit.reminders', 3)
        )
        this.isLoading = false
      })
      .catch((err) => this.notifier.error(err))
  }

  private async getAlerts(): Promise<void> {
    try {
      await this.fetchAlertTypes()

      const req: NotificationRequest = {
        organization: this.context.organizationId,
        account: this.context.user.id,
        triggeredBy: this.context.accountId,
        viewed: false,
        limit: 'all'
      }

      const res = await this.alert.fetchNotifications(req)
      this.alerts = []
      const now = moment()
      res.data
        .map((element: any) => ({
          ...element,
          type: {
            ...element.type,
            code: CcrAlertNotification.calculateAlertTypeCode(element.type.id)
          }
        }))
        .map((value: AlertNotification) => {
          let alert
          alert = find(this.alerts, ['code', value.type.code])

          // if already exists, add the index
          if (alert) {
            alert.ids.push(value.id)
            if (value.groupId) {
              alert.groupIds.push(value.groupId)
            }
            return
          }

          const foundAlertType = this.alertTypes.find(
            (alertType) =>
              alertType.typeCode === value.type.code ||
              alertType.option === value.type.code
          )

          // create the new alert type container
          alert = {
            createdAt: value.createdAt,
            code: value.type.code,
            params: {},
            detail: '',
            icon: '',
            groupIds: value.groupId ? [value.groupId] : [],
            ids: [value.id],
            texts:
              foundAlertType && foundAlertType.texts
                ? foundAlertType.texts
                : null
          }
          const units = this.context.user.measurementPreference

          switch (value.type.code) {
            // 1. Weight Regained
            case 'weight-regained':
              const val = (value.payload as AlertsWeightRegainedPayload).value
              alert.params['value'] = unitConversion(units, 'composition', val)
              alert.params['unit'] =
                this.i18n[unitLabel(units, 'composition', val)]
              alert.detail = _('ALERTS.WEIGHT_REGAINED')
              alert.icon = 'trending-up'
              break

            // 2. Meal logging
            case 'meal-logging':
              const since =
                value.payload &&
                (value.payload as AlertsGenericPayload).lastMeasurement
                  ? moment(
                      (value.payload as AlertsGenericPayload).lastMeasurement
                    )
                  : undefined
              alert.params['date'] =
                since !== undefined ? since.to(now) : undefined
              alert.detail =
                alert.params['date'] !== undefined
                  ? _('ALERTS.MEAL_LOGGING')
                  : _('ALERTS.MEAL_LOGGING_NO_SINCE')
              alert.icon = 'food'
              break

            // 3. Tracker Syncing
            case 'tracker-syncing':
              alert.detail = _('ALERTS.TRACKER_SYNCING')
              alert.icon = 'tracker'
              break

            // 4. Weight Logging
            case 'weight-logging':
              alert.detail = _('ALERTS.WEIGHT_LOGGING')
              alert.icon = 'scale'
              break

            case 'weight-threshold':
              if (
                (value.payload as AlertsGenericPayload).weight !== undefined
              ) {
                const weight = (value.payload as AlertsGenericPayload).weight
                alert.params['value'] = unitConversion(
                  units,
                  'composition',
                  (weight as { delta: number }).delta
                )
                alert.params['unit'] =
                  this.i18n[unitLabel(units, 'composition', val)]
                alert.detail = _('ALERTS.WEIGHT_REGAINED')

                if (alert.params['value'] < 0) {
                  alert.detail = _('ALERTS.WEIGHT_LOST')
                  alert.params['value'] = Math.abs(alert.params['value'])
                }

                alert.icon = 'weight-thresh'
              }
              break

            case 'data-point-threshold':
              alert.icon = 'circle_notifications'
              alert.detail = _('ALERTS.TYPES.DATA_THRESHOLD_ALERT')
              alert.payload = value.payload
              alert.texts.titleSuffix = alert.payload.dataPoint.type.name
              break

            case 'missing-data-point':
              alert.icon = 'missing-data'
              alert.detail = _('ALERTS.TYPES.MISSING_DATA_ALERT')
              alert.payload = value.payload
              alert.texts.titleSuffix = alert.payload.dataPoint.type.name
              break
          }

          this.alerts.push(alert)
          return
        })
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
