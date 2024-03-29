import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import {
  AlertTypesDataSource,
  AlertTypesPreference
} from '@app/dashboard/alerts/services'
import { ContextService, NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared'
import { _, SelectOptions, uxPoundsToGrams } from '@app/shared/utils'
import {
  AlertOrgPreference,
  CreateOrgAlertPreferenceRequest,
  UpdateOrgAlertPreferenceRequest
} from '@coachcare/sdk'
import { Alerts } from '@coachcare/sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { filter } from 'rxjs/operators'
import { AlertDataThresholdDialog } from '../../dialogs'

@Component({
  selector: 'app-alert-types-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class AlertTypesTableComponent implements OnInit {
  @Input()
  source: AlertTypesDataSource
  @Input()
  columns = ['enabled', 'title', 'settings', 'actions']

  inactivityDays = [
    { value: '1 day', viewValue: 1 },
    { value: '2 days', viewValue: 2 },
    { value: '3 days', viewValue: 3 },
    { value: '4 days', viewValue: 4 },
    { value: '5 days', viewValue: 5 },
    { value: '6 days', viewValue: 6 },
    { value: '7 days', viewValue: 7 },
    { value: '8 days', viewValue: 8 },
    { value: '9 days', viewValue: 9 },
    { value: '10 days', viewValue: 10 },
    { value: '11 days', viewValue: 11 },
    { value: '12 days', viewValue: 12 },
    { value: '13 days', viewValue: 13 },
    { value: '14 days', viewValue: 14 },
    { value: '15 days', viewValue: 15 },
    { value: '16 days', viewValue: 16 },
    { value: '17 days', viewValue: 17 },
    { value: '18 days', viewValue: 18 },
    { value: '19 days', viewValue: 19 },
    { value: '20 days', viewValue: 20 }
  ]

  spanDays = [
    { value: 1, viewValue: 1 },
    { value: 2, viewValue: 2 },
    { value: 3, viewValue: 3 },
    { value: 4, viewValue: 4 },
    { value: 5, viewValue: 5 },
    { value: 6, viewValue: 6 },
    { value: 7, viewValue: 7 },
    { value: 8, viewValue: 8 },
    { value: 9, viewValue: 9 },
    { value: 10, viewValue: 10 },
    { value: 11, viewValue: 11 },
    { value: 12, viewValue: 12 },
    { value: 13, viewValue: 13 },
    { value: 14, viewValue: 14 },
    { value: 15, viewValue: 15 },
    { value: 16, viewValue: 16 },
    { value: 17, viewValue: 17 },
    { value: 18, viewValue: 18 },
    { value: 19, viewValue: 19 },
    { value: 20, viewValue: 20 },
    { value: 21, viewValue: 21 },
    { value: 22, viewValue: 22 },
    { value: 23, viewValue: 23 },
    { value: 24, viewValue: 24 },
    { value: 25, viewValue: 25 },
    { value: 26, viewValue: 26 },
    { value: 27, viewValue: 27 },
    { value: 28, viewValue: 28 },
    { value: 29, viewValue: 29 },
    { value: 30, viewValue: 30 },
    { value: 31, viewValue: 31 },
    { value: 32, viewValue: 32 },
    { value: 33, viewValue: 33 },
    { value: 34, viewValue: 34 },
    { value: 35, viewValue: 35 },
    { value: 36, viewValue: 36 },
    { value: 37, viewValue: 37 },
    { value: 38, viewValue: 38 },
    { value: 39, viewValue: 39 },
    { value: 40, viewValue: 40 },
    { value: 41, viewValue: 41 },
    { value: 42, viewValue: 42 },
    { value: 43, viewValue: 43 },
    { value: 44, viewValue: 44 },
    { value: 45, viewValue: 45 },
    { value: 46, viewValue: 46 },
    { value: 47, viewValue: 47 },
    { value: 48, viewValue: 48 },
    { value: 49, viewValue: 49 },
    { value: 50, viewValue: 50 }
  ]

  triggerPeriods = [
    { value: 'daily', viewValue: _('ALERTS.DAILY') },
    { value: 'spanEnd', viewValue: _('ALERTS.SPAN_END') }
  ]

  weightRegainedOptions: SelectOptions<number> = []
  WeightThresholdThresholdOptions: SelectOptions<number> = []

  constructor(
    private alerts: Alerts,
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    const pref = this.context.user.measurementPreference

    for (let i = 1; i <= 20; i++) {
      const value = uxPoundsToGrams(pref, i)
      this.weightRegainedOptions.push({
        value,
        viewValue: ''
      })
    }

    for (let i = 0; i <= 20; i++) {
      const value = uxPoundsToGrams(pref, i)
      this.WeightThresholdThresholdOptions.push({
        value,
        viewValue: ''
      })
    }
  }

  onActiveChange(row: AlertTypesPreference): void {
    switch (row.typeCode) {
      case 'inactivity':
        return this.updateInactivity(row)
      case 'weight-regained':
        return this.updateWeightRegained(row)
      case 'weight-threshold':
        this.source.result.forEach((preference: AlertTypesPreference) => {
          if (
            preference.typeCode === 'weight-threshold' &&
            preference.option !== 'header'
          ) {
            preference.isActive = row.isActive
            preference.isVisible =
              preference.overrideVisibility !== undefined
                ? preference.overrideVisibility
                : row.isActive
          }
        })
        return this.updateWeightThreshold(row)
      case 'data-point-threshold':
      case 'missing-data-point':
        void this.updateCustomAlertPreference(row)
        break
    }
  }

  public openDataThresholdDialog(row?: AlertTypesPreference): void {
    if (row?.isInherited) {
      return
    }

    this.dialog
      .open(AlertDataThresholdDialog, {
        data: {
          preference: row,
          mode: row ? 'edit' : 'create'
        },
        width: !this.deviceDetector.isMobile() ? '60vw' : undefined
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  /**
   * This function can only be used to delete DataPointThreshold and MissingDataPoint alerts
   */
  public openDeleteAlertDialog(row: AlertTypesPreference): void {
    if (row.isInherited) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('ALERTS.DELETE_ALERT'),
          content: _('ALERTS.DELETE_ALERT_DESCRIPTION')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.deleteAlertPreference(row))
  }

  updateInactivity(current: AlertTypesPreference): void {
    const preference: AlertOrgPreference = {
      isActive: false,
      options: {}
    }

    this.source.result.map((row) => {
      if (current.typeCode === row.typeCode) {
        if (row.isActive) {
          preference.isActive = true
          preference.options[row.option] = row.value
        } else if (this.source.prefIds[row.typeCode]) {
          preference.options[row.option] = null
        }
      }
    })

    // Workaround for the following weeks to support deactivating all inactivity alerts -- Zcyon
    if (!preference.isActive) {
      this.source.result.map((row) => {
        if (current.typeCode === row.typeCode) {
          preference.options[row.option] = row.value
        }
      })
    }

    this.saveAlertPreference(current, preference)
  }

  updateWeightThreshold(current: AlertTypesPreference): void {
    const preference: AlertOrgPreference = {
      isActive: false,
      options: {}
    }

    this.source.result.map((row) => {
      if (current.typeCode === row.typeCode) {
        preference.isActive = current.isActive

        if (row.optionExt) {
          const innerProp = row.optionExt.substring(1, row.optionExt.length)
          preference.options[row.option] = preference.options[row.option]
            ? {
                ...preference.options[row.option],
                [innerProp]: row.value[innerProp]
              }
            : row.value
        } else {
          preference.options[row.option] = row.value
        }
      }
    })

    this.saveAlertPreference(current, preference)
  }

  updateWeightRegained(row: AlertTypesPreference): void {
    const preference = {
      isActive: row.isActive,
      options: {
        threshold: Math.round(row.value)
      }
    }

    this.saveAlertPreference(row, preference)
  }

  saveAlertPreference(
    row: AlertTypesPreference,
    preference: AlertOrgPreference
  ): void {
    if (this.source.prefIds[row.typeCode]) {
      const req: UpdateOrgAlertPreferenceRequest = {
        id: this.source.prefIds[row.typeCode],
        preference
      }
      this.alerts
        .updateOrgAlertPreference(req)
        .then(() => {
          this.notifier.success(_('NOTIFY.SUCCESS.ALERT_UPDATED'))
        })
        .catch((err) => this.notifier.error(err))
    } else {
      const req: CreateOrgAlertPreferenceRequest = {
        organization: this.source.args.organization,
        alertType: row.typeId,
        preference
      }
      this.alerts
        .createOrgAlertPreference(req)
        .then((id) => {
          this.source.prefIds[row.typeCode] = id
          this.notifier.success(_('NOTIFY.SUCCESS.ALERT_CREATED'))
        })
        .catch((err) => this.notifier.error(err))
    }
  }

  /**
   * Logic to specifically update Custom Alerts
   */
  private async updateCustomAlertPreference(
    row: AlertTypesPreference
  ): Promise<void> {
    try {
      await this.alerts.updateOrgAlertPreference({
        id: row.value.id,
        preference: {
          isActive: row.isActive,
          options: row.value.organization.preference.options
        }
      })

      this.notifier.success(_('NOTIFY.SUCCESS.ALERT_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  /**
   * This function can only be used to delete DataPointThreshold and MissingDataPoint alerts
   */
  private async deleteAlertPreference(
    row: AlertTypesPreference
  ): Promise<void> {
    try {
      await this.alerts.deleteOrgAlertPreference(row.value.id)
      this.notifier.success(_('NOTIFY.SUCCESS.ALERT_DELETED'))
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
