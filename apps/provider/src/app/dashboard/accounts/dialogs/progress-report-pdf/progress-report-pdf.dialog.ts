import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { CCRConfig } from '@app/config'
import { ContextService, NotifierService } from '@app/service'
import {
  calculateProgressElementRow,
  ChartData,
  DieterSummaryElement,
  getProgressPDFCellColor,
  imageToDataURL
} from '@app/shared'
import { paletteSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import * as pdfMake from 'pdfmake'
import { first } from 'rxjs/operators'
import {
  AccountProvider,
  AccSingleResponse,
  DieterDashboardSummary,
  OrganizationProvider
} from '@coachcare/npm-api'
import { BodyMeasurement } from '../../dieters/models/measurement/bodyMeasurement'
import {
  MeasurementDatabase,
  MeasurementDataSource
} from '../../dieters/services'

interface DieterSummaryPDFData {
  dateRange: {
    start: string
    end: string
  }
  date?: DieterSummaryElement
  composition?: {
    bmi: DieterSummaryElement
    bodyFat: DieterSummaryElement
    bodyFatPercentage: DieterSummaryElement
    leanMass: DieterSummaryElement
    visceralAdiposeTissue: DieterSummaryElement
    visceralFatRating: DieterSummaryElement
    waterPercentage: DieterSummaryElement
    weight: DieterSummaryElement
  }
  weeksOnProtocol: number
  measurements?: {
    chest: DieterSummaryElement
    arm: DieterSummaryElement
    waist: DieterSummaryElement
    hips: DieterSummaryElement
    thigh: DieterSummaryElement
  }
  totalInches?: number
  totalInchesCellColor?: string
}

interface YearWeekOption {
  value: number
  viewValue: string
}

@Component({
  selector: 'app-progress-report-pdf-dialog',
  templateUrl: './progress-report-pdf.dialog.html',
  styleUrls: ['./progress-report-pdf.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class ProgressReportPDFDialog implements OnInit {
  @ViewChild('chartCanvas', { static: false }) canvas

  acc: AccSingleResponse
  chart: ChartData
  form: FormGroup
  isLoading = true
  today: moment.Moment = moment()
  yearWeeks: YearWeekOption[] = []

  private pdfColor = '#3aa2cf'

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private data: DieterDashboardSummary,
    private dialog: MatDialogRef<ProgressReportPDFDialog>,
    private fb: FormBuilder,
    private measurementDatabase: MeasurementDatabase,
    private notify: NotifierService,
    private organization: OrganizationProvider,
    private store: Store<CCRConfig>,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.fetchAccount()
    this.fetchColors()
    this.yearWeeks = this.calculateYearWeeks()

    this.form.patchValue({ week: this.yearWeeks.length - 1 })
  }

  async onGeneratePDF() {
    await this.data.init(this.context.accountId)
    const org = await this.organization.getSingle(this.context.organizationId)

    const weightUnit =
      this.context.user.measurementPreference === 'us' ||
      this.context.user.measurementPreference === 'uk'
        ? 'lbs'
        : 'kg'
    const distanceUnit =
      this.context.user.measurementPreference === 'us' ||
      this.context.user.measurementPreference === 'uk'
        ? 'in'
        : 'cm'

    const footerImage = new Image()
    footerImage.src = 'assets/img/shiftsetgo/footerimg.png'

    const measurementSource = new MeasurementDataSource(
      this.notify,
      this.measurementDatabase,
      this.translateService,
      this.context,
      this.store
    )

    const account = await this.account.getSingle(this.context.accountId)
    const weekDate = moment(account.clientData.startedAt || account.createdAt)
      .startOf('week')
      .add(this.form.value.week, 'weeks')

    const startDate = weekDate.clone().startOf('week')
    const endDate = weekDate.clone().endOf('week')

    measurementSource.addDefault({
      account: this.context.accountId,
      data: [
        'weight',
        'bmi',
        'bodyFat',
        'waist',
        'arm',
        'chest',
        'hip',
        'thigh',
        'weight'
      ],
      startDate: moment(
        account.clientData.startedAt || account.createdAt
      ).toISOString(),
      endDate: endDate.toISOString(),
      unit: 'day',
      useNewEndpoint: true,
      max: 'all',
      omitEmptyDays: true
    })

    const values = await measurementSource.connect().pipe(first()).toPromise()

    const weekDiff = Math.abs(startDate.diff(endDate, 'week')) || 1

    let pdfData: DieterSummaryPDFData = {
      dateRange: {
        start: startDate.format('MM/DD/YYYY'),
        end: endDate.format('MM/DD/YYYY')
      },
      weeksOnProtocol: weekDiff
    }

    pdfData = this.calculatePatientPDFData(
      values,
      pdfData,
      startDate.week(),
      startDate.year()
    )

    const definition = {
      pageSize: 'Letter',
      pageOrientation: 'portrait',
      pageMargins: [40, 40, 40, 60],
      header: {
        text: 'Weight Loss Progress Report',
        color: this.pdfColor,
        style: 'header',
        margin: [30, 10, 30, 10]
      },
      content: [
        {
          canvas: [
            {
              type: 'line',
              x1: -60,
              y1: 10,
              x2: 595,
              y2: 10,
              lineWidth: 2,
              lineColor: this.pdfColor
            }
          ]
        },
        { text: ' ', lineHeight: 1 },
        {
          text: `${account.firstName} ${account.lastName}`,
          style: 'subheader'
        },
        {
          lineHeight: 2,
          text: `Program Dates (${pdfData.dateRange.start} - ${pdfData.dateRange.end})`,
          style: 'subheader'
        },
        {
          table: {
            headerRows: 1,
            widths: [90, 78, 78, 78, 78, 78],
            body: [
              [
                {
                  text: 'Body Composition',
                  colSpan: 6,
                  alignment: 'center'
                },
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' }
              ],
              [
                ' ',
                'Beginning',
                'Last Week',
                'Current Week',
                'Change this Week',
                'Cumulative Change'
              ],
              [
                'Date',
                `${
                  pdfData.composition.weight.begginingMeasurement
                    ? moment(
                        pdfData.composition.weight.begginingMeasurement.date
                      ).format('MM/DD/YYYY')
                    : '-'
                }`,
                `${
                  pdfData.composition.weight.lastWeekMeasurement
                    ? moment(
                        pdfData.composition.weight.lastWeekMeasurement.date
                      ).format('MM/DD/YYYY')
                    : '-'
                }`,
                `${
                  pdfData.composition.weight.currentWeekMeasurement
                    ? moment(
                        pdfData.composition.weight.currentWeekMeasurement.date
                      ).format('MM/DD/YYYY')
                    : '-'
                }`,
                ``,
                ``
              ],
              [
                'Weight',
                `${pdfData.composition.weight.beginningString} ${
                  pdfData.composition.weight.beginning !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.weight.lastWeekString} ${
                  pdfData.composition.weight.lastWeek !== null ? weightUnit : ''
                }`,
                `${pdfData.composition.weight.currentWeekString} ${
                  pdfData.composition.weight.currentWeek !== null
                    ? weightUnit
                    : ''
                }`,
                {
                  text: `${pdfData.composition.weight.changeThisWeekString} ${
                    pdfData.composition.weight.changeThisWeek !== null
                      ? weightUnit
                      : ''
                  }`,
                  fillColor: pdfData.composition.weight.changeThisWeekCellColor
                },
                {
                  text: `${pdfData.composition.weight.cumulativeChangeString} ${
                    pdfData.composition.weight.cumulativeChange !== null
                      ? weightUnit
                      : ''
                  }`,
                  fillColor:
                    pdfData.composition.weight.cumulativeChangeCellColor
                }
              ],
              [
                'Body Fat %',
                `${pdfData.composition.bodyFatPercentage.beginningString} ${
                  pdfData.composition.bodyFatPercentage.beginning !== null
                    ? '%'
                    : ''
                }`,
                `${pdfData.composition.bodyFatPercentage.lastWeekString} ${
                  pdfData.composition.bodyFatPercentage.lastWeek !== null
                    ? '%'
                    : ''
                }`,
                `${pdfData.composition.bodyFatPercentage.currentWeekString} ${
                  pdfData.composition.bodyFatPercentage.currentWeek !== null
                    ? '%'
                    : ''
                }`,
                {
                  text: `${
                    pdfData.composition.bodyFatPercentage.changeThisWeekString
                  } ${
                    pdfData.composition.bodyFatPercentage.changeThisWeek !==
                    null
                      ? '%'
                      : ''
                  }`,
                  fillColor:
                    pdfData.composition.bodyFatPercentage
                      .changeThisWeekCellColor
                },
                {
                  text: `${
                    pdfData.composition.bodyFatPercentage.cumulativeChangeString
                  } ${
                    pdfData.composition.bodyFatPercentage.cumulativeChange !==
                    null
                      ? '%'
                      : ''
                  }`,
                  fillColor:
                    pdfData.composition.bodyFatPercentage
                      .cumulativeChangeCellColor
                }
              ],
              [
                'BMI',
                pdfData.composition.bmi.beginningString,
                pdfData.composition.bmi.lastWeekString,
                pdfData.composition.bmi.currentWeekString,
                {
                  text: pdfData.composition.bmi.changeThisWeekString,
                  fillColor: pdfData.composition.bmi.changeThisWeekCellColor
                },
                {
                  text: pdfData.composition.bmi.cumulativeChangeString,
                  fillColor: pdfData.composition.bmi.cumulativeChangeCellColor
                }
              ],
              [
                'Lean Mass',
                `${pdfData.composition.leanMass.beginningString} ${
                  pdfData.composition.leanMass.beginning !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.leanMass.lastWeekString} ${
                  pdfData.composition.leanMass.lastWeek !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.leanMass.currentWeekString} ${
                  pdfData.composition.leanMass.currentWeek !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.leanMass.changeThisWeekString} ${
                  pdfData.composition.leanMass.changeThisWeek !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.leanMass.cumulativeChangeString} ${
                  pdfData.composition.leanMass.cumulativeChange !== null
                    ? weightUnit
                    : ''
                }`
              ],
              [
                'Fat Mass',
                `${pdfData.composition.bodyFat.beginningString} ${
                  pdfData.composition.bodyFat.beginning !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.bodyFat.lastWeekString} ${
                  pdfData.composition.bodyFat.lastWeek !== null
                    ? weightUnit
                    : ''
                }`,
                `${pdfData.composition.bodyFat.currentWeekString} ${
                  pdfData.composition.bodyFat.currentWeek !== null
                    ? weightUnit
                    : ''
                }`,
                {
                  text: `${pdfData.composition.bodyFat.changeThisWeekString} ${
                    pdfData.composition.bodyFat.changeThisWeek !== null
                      ? weightUnit
                      : ''
                  }`,
                  fillColor: pdfData.composition.bodyFat.changeThisWeekCellColor
                },
                {
                  text: `${
                    pdfData.composition.bodyFat.cumulativeChangeString
                  } ${
                    pdfData.composition.bodyFat.cumulativeChange !== null
                      ? weightUnit
                      : ''
                  }`,
                  fillColor:
                    pdfData.composition.bodyFat.cumulativeChangeCellColor
                }
              ],
              [
                'Visceral Fat Rating',
                `${pdfData.composition.visceralFatRating.beginningString}`,
                `${pdfData.composition.visceralFatRating.lastWeekString}`,
                `${pdfData.composition.visceralFatRating.currentWeekString}`,
                {
                  text: `${pdfData.composition.visceralFatRating.changeThisWeekString}`,
                  fillColor:
                    pdfData.composition.visceralFatRating
                      .changeThisWeekCellColor
                },
                {
                  text: `${pdfData.composition.visceralFatRating.cumulativeChangeString}`,
                  fillColor:
                    pdfData.composition.visceralFatRating
                      .cumulativeChangeCellColor
                }
              ],
              [
                'Visceral Adipose Tissue',
                `${pdfData.composition.visceralAdiposeTissue.beginningString} ${
                  pdfData.composition.visceralAdiposeTissue.beginning !== null
                    ? 'l'
                    : ''
                }`,
                `${pdfData.composition.visceralAdiposeTissue.lastWeekString} ${
                  pdfData.composition.visceralAdiposeTissue.lastWeek !== null
                    ? 'l'
                    : ''
                }`,
                `${
                  pdfData.composition.visceralAdiposeTissue.currentWeekString
                } ${
                  pdfData.composition.visceralAdiposeTissue.currentWeek !== null
                    ? 'l'
                    : ''
                }`,
                {
                  text: `${
                    pdfData.composition.visceralAdiposeTissue
                      .changeThisWeekString
                  } ${
                    pdfData.composition.visceralAdiposeTissue.changeThisWeek !==
                    null
                      ? 'l'
                      : ''
                  }`,
                  fillColor:
                    pdfData.composition.visceralAdiposeTissue
                      .changeThisWeekCellColor
                },
                {
                  text: `${
                    pdfData.composition.visceralAdiposeTissue
                      .cumulativeChangeString
                  } ${
                    pdfData.composition.visceralAdiposeTissue
                      .cumulativeChange !== null
                      ? 'l'
                      : ''
                  }`,
                  fillColor:
                    pdfData.composition.visceralAdiposeTissue
                      .cumulativeChangeCellColor
                }
              ],
              [
                'Hydration',
                `${pdfData.composition.waterPercentage.beginningString} ${
                  pdfData.composition.waterPercentage.beginning !== null
                    ? '%'
                    : ''
                }`,
                `${pdfData.composition.waterPercentage.lastWeekString} ${
                  pdfData.composition.waterPercentage.lastWeek !== null
                    ? '%'
                    : ''
                }`,
                `${pdfData.composition.waterPercentage.currentWeekString} ${
                  pdfData.composition.waterPercentage.currentWeek !== null
                    ? '%'
                    : ''
                }`,
                `${pdfData.composition.waterPercentage.changeThisWeekString} ${
                  pdfData.composition.waterPercentage.changeThisWeek !== null
                    ? '%'
                    : ''
                }`,
                `${
                  pdfData.composition.waterPercentage.cumulativeChangeString
                } ${
                  pdfData.composition.waterPercentage.cumulativeChange !== null
                    ? '%'
                    : ''
                }`
              ]
            ]
          }
        },
        { text: ' ', lineHeight: 1 },
        {
          table: {
            headerRows: 1,
            widths: [90, 78, 78, 78, 78, 78],
            body: [
              [
                { text: 'Measurements', colSpan: 6, alignment: 'center' },
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' }
              ],
              [
                ' ',
                'Beginning',
                'Last Week',
                'Current Week',
                'Change this Week',
                'Cumulative Change'
              ],
              [
                'Chest',
                `${pdfData.measurements.chest.beginningString} ${
                  pdfData.measurements.chest.beginning !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.chest.lastWeekString} ${
                  pdfData.measurements.chest.lastWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.chest.currentWeekString} ${
                  pdfData.measurements.chest.currentWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                {
                  text: `${pdfData.measurements.chest.changeThisWeekString} ${
                    pdfData.measurements.chest.changeThisWeek !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.chest.changeThisWeekCellColor
                },
                {
                  text: `${pdfData.measurements.chest.cumulativeChangeString} ${
                    pdfData.measurements.chest.cumulativeChange !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor:
                    pdfData.measurements.chest.cumulativeChangeCellColor
                }
              ],
              [
                'Arm',
                `${pdfData.measurements.arm.beginningString} ${
                  pdfData.measurements.arm.beginning !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.arm.lastWeekString} ${
                  pdfData.measurements.arm.lastWeek !== null ? distanceUnit : ''
                }`,
                `${pdfData.measurements.arm.currentWeekString} ${
                  pdfData.measurements.arm.currentWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                {
                  text: `${pdfData.measurements.arm.changeThisWeekString} ${
                    pdfData.measurements.arm.changeThisWeek !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.arm.changeThisWeekCellColor
                },
                {
                  text: `${pdfData.measurements.arm.cumulativeChangeString} ${
                    pdfData.measurements.arm.cumulativeChange !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.arm.cumulativeChangeCellColor
                }
              ],
              [
                'Waist',
                `${pdfData.measurements.waist.beginningString} ${
                  pdfData.measurements.waist.beginning !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.waist.lastWeekString} ${
                  pdfData.measurements.waist.lastWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.waist.currentWeekString} ${
                  pdfData.measurements.waist.currentWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                {
                  text: `${pdfData.measurements.waist.changeThisWeekString} ${
                    pdfData.measurements.waist.changeThisWeek !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.waist.changeThisWeekCellColor
                },
                {
                  text: `${pdfData.measurements.waist.cumulativeChangeString} ${
                    pdfData.measurements.waist.cumulativeChange !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor:
                    pdfData.measurements.waist.cumulativeChangeCellColor
                }
              ],
              [
                'Hips',
                `${pdfData.measurements.hips.beginningString} ${
                  pdfData.measurements.hips.beginning !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.hips.lastWeekString} ${
                  pdfData.measurements.hips.lastWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.hips.currentWeekString} ${
                  pdfData.measurements.hips.currentWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                {
                  text: `${pdfData.measurements.hips.changeThisWeekString} ${
                    pdfData.measurements.hips.changeThisWeek !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.hips.changeThisWeekCellColor
                },
                {
                  text: `${pdfData.measurements.hips.cumulativeChangeString} ${
                    pdfData.measurements.hips.cumulativeChange !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.hips.cumulativeChangeCellColor
                }
              ],
              [
                'Thigh',
                `${pdfData.measurements.thigh.beginningString} ${
                  pdfData.measurements.thigh.beginning !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.thigh.lastWeekString} ${
                  pdfData.measurements.thigh.lastWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                `${pdfData.measurements.thigh.currentWeekString} ${
                  pdfData.measurements.thigh.currentWeek !== null
                    ? distanceUnit
                    : ''
                }`,
                {
                  text: `${pdfData.measurements.thigh.changeThisWeekString} ${
                    pdfData.measurements.thigh.changeThisWeek !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor: pdfData.measurements.thigh.changeThisWeekCellColor
                },
                {
                  text: `${pdfData.measurements.thigh.cumulativeChangeString} ${
                    pdfData.measurements.thigh.cumulativeChange !== null
                      ? distanceUnit
                      : ''
                  }`,
                  fillColor:
                    pdfData.measurements.thigh.cumulativeChangeCellColor
                }
              ],
              [
                {
                  text: `Total ${
                    distanceUnit === 'in' ? 'Inches' : 'Centimeters'
                  } Lost`,
                  colSpan: 4
                },
                { text: '' },
                { text: '' },
                { text: '' },
                {
                  text: `${pdfData.totalInches.toFixed(2)} ${distanceUnit}`,
                  colSpan: 2,
                  fillColor: pdfData.totalInchesCellColor
                },
                { text: '' }
              ]
            ]
          }
        },
        { text: ' ', lineHeight: 2 },
        {
          stack: [
            {
              text: `Progress Report Generated by: ${org.name}`
            },
            {
              text: `${org.name} - ${org.address.city},`
            },
            { text: `${org.address.street},` },
            { text: `${org.address.postalCode} ${org.contact.phone}` },
            { text: ' ', lineHeight: 2 },
            { text: `${org.contact.email}` }
          ]
        },
        { text: ' ', lineHeight: 2 },
        {
          canvas: [
            {
              type: 'line',
              x1: -60,
              y1: 20,
              x2: 595,
              y2: 20,
              lineWidth: 2,
              lineColor: this.pdfColor
            }
          ]
        }
      ],
      footer: {
        stack: [
          {
            image: imageToDataURL(footerImage),
            fit: [100, 100],
            absolutePosition: { x: 0, y: -40 }
          },
          {
            text: 'A SHIFTED APPROACH TO WEIGHT LOSS™ | shiftsetgo.com',
            alignment: 'right',
            color: this.pdfColor
          }
        ],
        lineHeight: 1.5,
        margin: [30, 10, 30, 0]
      },
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        footer: {
          fontSize: 9
        },
        subheader: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        }
      }
    }
    pdfMake.createPdf(definition).open()
    this.dialog.close()
  }

  private calculatePatientPDFData(
    values: BodyMeasurement[],
    currentObj: DieterSummaryPDFData,
    weekIndex: number = 0,
    year: number
  ): DieterSummaryPDFData {
    const partialResults: DieterSummaryPDFData = currentObj

    // Calculate composition elements
    partialResults.composition = {
      bmi: calculateProgressElementRow(weekIndex, year, values, 'bmi'),
      bodyFatPercentage: calculateProgressElementRow(
        weekIndex,
        year,
        values,
        'bodyFatPercentage'
      ),
      bodyFat: calculateProgressElementRow(weekIndex, year, values, 'bodyFat'),
      leanMass: calculateProgressElementRow(
        weekIndex,
        year,
        values,
        'leanMass'
      ),
      visceralFatRating: calculateProgressElementRow(
        weekIndex,
        year,
        values,
        'visceralFatTanita',
        0
      ),
      visceralAdiposeTissue: calculateProgressElementRow(
        weekIndex,
        year,
        values,
        'visceralAdiposeTissue',
        1
      ),
      waterPercentage: calculateProgressElementRow(
        weekIndex,
        year,
        values,
        'waterPercentage'
      ),
      weight: calculateProgressElementRow(weekIndex, year, values, 'weight')
    }

    // Calculate measurements elements
    partialResults.measurements = {
      chest: calculateProgressElementRow(weekIndex, year, values, 'chest'),
      arm: calculateProgressElementRow(weekIndex, year, values, 'arm'),
      waist: calculateProgressElementRow(weekIndex, year, values, 'waist'),
      hips: calculateProgressElementRow(weekIndex, year, values, 'hip'),
      thigh: calculateProgressElementRow(weekIndex, year, values, 'thigh')
    }

    partialResults.totalInches = +(
      (partialResults.measurements.chest.cumulativeChange || 0) +
      (partialResults.measurements.arm.cumulativeChange || 0) +
      (partialResults.measurements.waist.cumulativeChange || 0) +
      (partialResults.measurements.hips.cumulativeChange || 0) +
      (partialResults.measurements.thigh.cumulativeChange || 0)
    ).toFixed(2)
    partialResults.totalInchesCellColor = getProgressPDFCellColor(
      partialResults.totalInches,
      'totalInchesChange'
    )

    return partialResults
  }

  private calculateYearWeeks(
    start: moment.Moment = moment().startOf('year').startOf('week')
  ): YearWeekOption[] {
    const options: YearWeekOption[] = []

    const beginning = start
    const today = moment()
    const currentWeek = beginning

    let weekCount = 0

    while (currentWeek.isSameOrBefore(today, 'week')) {
      options.push({
        value: weekCount++,
        viewValue: `${currentWeek
          .startOf('week')
          .format('MM/DD/YYYY')} - ${currentWeek
          .endOf('week')
          .format('MM/DD/YYYY')}`
      })
      currentWeek.add(1, 'week')
    }

    return options
  }

  private createForm(): void {
    this.form = this.fb.group({
      week: [0]
    })
  }

  private async fetchAccount() {
    try {
      this.isLoading = true
      const account = await this.account.getSingle(this.context.accountId)
      let startDate = moment(account.clientData.startedAt || account.createdAt)
      this.acc = account
      if (startDate.isAfter(moment(), 'day')) {
        startDate = this.today
      }
      this.yearWeeks = this.calculateYearWeeks(
        startDate.clone().startOf('week')
      )
      this.form.patchValue({ week: this.yearWeeks.length - 1 })
    } catch (error) {
      this.notify.error(error)
      this.dialog.close()
    } finally {
      this.isLoading = false
    }
  }

  private fetchColors(): void {
    this.store.pipe(select(paletteSelector)).subscribe((palette) => {
      this.pdfColor =
        (palette.theme === 'accent' ? palette.accent : palette.primary) ||
        this.pdfColor
    })
  }
}
