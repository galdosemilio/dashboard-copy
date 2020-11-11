import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import * as moment from 'moment'
import { IncludeRecord, SummaryProperty } from '@coachcare/npm-api'
import { MeasurementConfig } from '../../dieters'
import { BodyMeasurement } from '../../dieters/models/measurement/bodyMeasurement'
import {
  BodyMeasurementDataSource,
  MeasurementDatabase
} from '../../dieters/services'

interface MeasurementDetailDialogData {
  account: string
  row: any
  section: string
  sections: MeasurementConfig[]
}

@Component({
  selector: 'app-measurement-detail-dialog',
  templateUrl: './measurement-detail.dialog.html',
  styleUrls: ['./measurement-detail.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class MeasurementDetailDialog implements OnInit {
  columns: string[] = []
  date: string
  refreshOrigin = false
  source: BodyMeasurementDataSource
  title: string

  mandatoryColumns = ['device', 'actions']

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: MeasurementDetailDialogData,
    private database: MeasurementDatabase,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    const row = this.data.row
    const section = this.data.sections[this.data.section]
    const includes: IncludeRecord[] = section.data
      ? section.data.map((prop: string) => ({
          property: prop as SummaryProperty,
          positiveOnly: false
        }))
      : []

    this.columns =
      section.columns && section.columns.length
        ? [...section.columns, ...this.mandatoryColumns]
        : this.mandatoryColumns
    this.date = row.date
    this.title = 'GLOBAL.' + this.data.section.toUpperCase()
    this.source = new BodyMeasurementDataSource(
      this.notifier,
      this.database,
      this.context
    )
    this.source.addDefault({
      account: this.data.account,
      includes: includes,
      recordedAt: {
        start: moment(row.date).toISOString(),
        end: moment(row.date).toISOString()
      },
      sort: [{ property: 'recordedAt', dir: 'asc' }],
      limit: 'all'
    })
  }

  async deleteMeasurement(row: BodyMeasurement) {
    this.source.isLoading = true
    this.source.change$.next()

    await this.source.deleteBodyMeasurement({ id: row.id })
    this.refreshOrigin = true

    this.source.isLoading = false
    this.source.change$.next()
    this.source.refresh()
  }
}
