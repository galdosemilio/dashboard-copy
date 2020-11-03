import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/common/material'
import { CCRConfig } from '@app/config'
import { resolveConfig } from '@app/config/section'
import {
  FormSubmissionsDatabase,
  FormSubmissionsDatasource
} from '@app/dashboard/library/forms/services'
import { ContextService, NotifierService } from '@app/service'
import { imageToDataURL } from '@app/shared'
import { paletteSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { untilDestroyed } from 'ngx-take-until-destroy'
import pdfMake from 'pdfmake'
import { first } from 'rxjs/operators'
import { Account, DieterDashboardSummary, Organization } from 'selvera-api'
import { BodyMeasurement } from '../../dieters/models/measurement/bodyMeasurement'
import {
  MeasurementDatabase,
  MeasurementDataSource
} from '../../dieters/services'

interface PDFElement {
  startEntry?: BodyMeasurement
  start: number
  current: number
  change: number
}

interface PDFProvider {
  firstName: string
  lastName: string
  practice: string
  fax: string
}

interface PDFTableElement {
  startingWeek: string
  lastWeek: string
  currentWeek: string
  change: string
  cumulative: string
}

interface DoctorPDFData {
  bmi: PDFElement
  bodyFat: PDFElement
  date: string
  dateRange: {
    start: string
    end: string
  }
  patient: {
    name: string
    birthday: string
  }
  provider: {
    name: string
  }
  table?: {
    arm: PDFTableElement
    averageWeeklyLoss?: number
    bmi: PDFTableElement
    bodyFat: PDFTableElement
    chest: PDFTableElement
    date?: PDFTableElement
    fatMass: PDFTableElement
    hip: PDFTableElement
    hydration: PDFTableElement
    leanMass: PDFTableElement
    thigh: PDFTableElement
    totals?: {
      poundsLost: number
      inchesLost: number
      weeklyInchesLost: number
    }
    waist: PDFTableElement
    weight: PDFTableElement
  }
  weeks?: number
  weight: PDFElement
  weightLossPercent?: number
}

@Component({
  selector: 'app-doctor-pdf-dialog',
  templateUrl: './doctor-pdf.dialog.html',
  styleUrls: ['./doctor-pdf.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class DoctorPDFDialog implements OnDestroy, OnInit {
  form: FormGroup
  formId = ''
  isLoading: boolean
  pdfColor = '#3aa2cf'
  providers: PDFProvider[] = []
  source: FormSubmissionsDatasource

  private selectedProvider: PDFProvider

  constructor(
    private account: Account,
    private context: ContextService,
    private data: DieterDashboardSummary,
    private database: FormSubmissionsDatabase,
    private dialog: MatDialogRef<DoctorPDFDialog>,
    private fb: FormBuilder,
    private measurementDatabase: MeasurementDatabase,
    private notify: NotifierService,
    private organization: Organization,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {}

  async ngOnInit() {
    this.formId = resolveConfig(
      'JOURNAL.PHYSICIAN_FORM',
      this.context.organization,
      false
    )

    this.createForm()
    this.fetchProviders()
    this.fetchColors()
  }

  async onGeneratePDF() {
    await this.data.init(this.context.accountId)
    const weightUnit =
      this.context.user.measurementPreference === 'us' ||
      this.context.user.measurementPreference === 'uk'
        ? 'lbs'
        : 'kg'
    const footerImage = new Image()
    footerImage.src = 'assets/img/shiftsetgo/footerimg.png'
    const patient = await this.account.getSingle(this.context.accountId)
    const organization = await this.organization.getSingle(
      this.context.organizationId
    )

    const measurementSource = new MeasurementDataSource(
      this.notify,
      this.measurementDatabase,
      this.translate,
      this.context,
      this.store
    )

    measurementSource.addDefault({
      account: this.context.accountId,
      data: ['weight', 'bmi', 'bodyFat'],
      startDate: moment(
        patient.clientData.startedAt || patient.createdAt
      ).toISOString(),
      endDate: moment().toISOString(),
      unit: 'day',
      useNewEndpoint: true,
      max: 'all',
      omitEmptyDays: true
    })

    const values = await measurementSource.connect().pipe(first()).toPromise()

    const pdfData: DoctorPDFData = {
      bmi: this.calculateRowValue(values, 'bmi'),
      bodyFat: this.calculateRowValue(values, 'bodyFatPercentage'),
      date: moment().format('MM/DD/YYYY'),
      dateRange: {
        start: moment(patient.clientData.startedAt || patient.createdAt).format(
          'MM/DD/YYYY'
        ),
        end: moment().format('MM/DD/YYYY')
      },
      patient: {
        name: `${this.context.account.firstName} ${this.context.account.lastName}`,
        birthday: moment(patient.clientData.birthday).format('MM/DD/YYYY')
      },
      provider: {
        name: `${this.selectedProvider.firstName} ${this.selectedProvider.lastName}`
      },
      weight: this.calculateRowValue(values, 'weight')
    }

    pdfData.weeks = Math.abs(
      moment(pdfData.dateRange.start).diff(
        moment(pdfData.dateRange.end),
        'weeks'
      )
    )

    pdfData.weightLossPercent = +(
      ((pdfData.weight.start - pdfData.weight.current) / pdfData.weight.start) *
      100
    ).toFixed(2)

    pdfData.weightLossPercent = isNaN(pdfData.weightLossPercent)
      ? 0
      : pdfData.weightLossPercent

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
        { text: ' ', lineHeight: 2 },
        { text: `Date: ${pdfData.date}`, alignment: 'justify' },
        { text: `Patient: ${pdfData.patient.name}`, alignment: 'justify' },
        {
          text: `Patient Date of Birth: ${pdfData.patient.birthday}`,
          alignment: 'justify'
        },
        { text: ' ', lineHeight: 2 },
        { text: `Dear Dr. ${pdfData.provider.name}`, alignment: 'justify' },
        { text: ' ', lineHeight: 2 },
        {
          text: `Your patient listed above has been successful on the ShiftSetGo program at ${organization.name}.`,
          alignment: 'justify'
        },
        { text: ' ', lineHeight: 2 },
        {
          text:
            'Their success is a direct correlation to following the program which is designed to help patients achieve optimal weight loss while treating obesity at its core and addressing metabolic syndrome and insulin resistance. The program involves perfectly designed macro balanced meals and weekly coaching to help with nutrition education and behavior modification for life, not just through weight loss. A certified coach is here to guide your patient through the program with the goal of moving to a completely whole foods diet.',
          alignment: 'justify'
        },
        { text: ' ', lineHeight: 2 },
        {
          text:
            'We will continue to send you progress reports as your patient moves through the program.',
          alignment: 'justify'
        },
        { text: ' ', lineHeight: 2 },
        {
          text: 'To date your patient has made the following improvements:',
          alignment: 'justify'
        },
        { text: ' ', lineHeight: 1.5 },
        {
          table: {
            headerRows: 1,
            widths: [135, 120, 120, 120],
            body: [
              [
                { text: ' ' },
                { text: 'Starting', bold: true },
                { text: 'Current', bold: true },
                { text: 'Change', bold: true }
              ],
              [
                { text: 'Date', bold: true },
                `${
                  pdfData.weight.startEntry
                    ? moment(pdfData.weight.startEntry.date).format(
                        'MM/DD/YYYY'
                      )
                    : pdfData.dateRange.start
                }`,
                `${pdfData.dateRange.end}`,
                ``
              ],
              [
                { text: 'Weight', bold: true },
                `${pdfData.weight.start.toFixed(2)} ${weightUnit}`,
                `${pdfData.weight.current.toFixed(2)} ${weightUnit}`,
                `${pdfData.weight.change.toFixed(2)} ${weightUnit}`
              ],
              [
                { text: 'Body Fat %', bold: true },
                {
                  text: `${pdfData.bodyFat.start} %`,
                  fillColor: this.calculateRowFill(
                    pdfData.bodyFat.start,
                    'bodyFatPercentage'
                  )
                },
                {
                  text: `${pdfData.bodyFat.current} %`,
                  fillColor: this.calculateRowFill(
                    pdfData.bodyFat.current,
                    'bodyFatPercentage'
                  )
                },
                `${pdfData.bodyFat.change} %`
              ],
              [
                { text: 'BMI', bold: true },
                {
                  text: `${pdfData.bmi.start.toFixed(2)}`,
                  fillColor: this.calculateRowFill(pdfData.bmi.start, 'bmi')
                },
                {
                  text: `${pdfData.bmi.current.toFixed(2)}`,
                  fillColor: this.calculateRowFill(pdfData.bmi.current, 'bmi')
                },
                `${pdfData.bmi.change.toFixed(2)}`
              ]
            ]
          }
        },
        { text: ' ', lineHeight: 1.5 },
        {
          alignment: 'center',
          bold: true,
          fontSize: 18,
          text: `${
            pdfData.weightLossPercent >= 0
              ? 'Total % of weight loss: ' + pdfData.weightLossPercent
              : 'Total % of weight regained: ' +
                Math.abs(pdfData.weightLossPercent)
          }%`
        },
        { text: 'Yours in health,', alignment: 'left' },
        { text: ' ', lineHeight: 4 },
        { text: `${organization.name}`, alignment: 'left' },
        {
          text: `${organization.address.city}, ${organization.address.state}`,
          alignment: 'left'
        },
        { text: `${organization.contact.phone || 'N/A'}`, alignment: 'left' },
        { text: `${organization.contact.email}`, alignment: 'left' },
        { text: ' ', lineHeight: 1 },
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
        margin: [30, 0, 30, 0]
      },
      styles: {
        bold: {
          bold: true
        },
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

  private async fetchProviders() {
    try {
      this.isLoading = true
      this.source = new FormSubmissionsDatasource(this.database)
      this.source.addDefault({
        account: this.context.accountId,
        organization: this.context.organizationId,
        form: this.formId,
        limit: 'all',
        offset: 0
      })

      const submissions = await this.source
        .connect()
        .pipe(untilDestroyed(this), first())
        .toPromise()

      if (submissions.length) {
        const submissionPromises = submissions.map((submission) =>
          this.database.fetchAnswers({ id: submission.id }).toPromise()
        )
        const answers = await Promise.all(submissionPromises)
        this.providers = this.resolveProviders(answers)
        this.form.controls.provider.setValue(0)
      }
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private calculateRowValue(
    values: BodyMeasurement[],
    property: 'weight' | 'bmi' | 'bodyFatPercentage'
  ): PDFElement {
    const valuesCopy = values.slice()
    let start: number
    let current: number
    let change = 0

    const startObject = valuesCopy.find((entry) => entry[property])
    const currentObject = valuesCopy.reverse().find((entry) => entry[property])

    start = startObject ? startObject[property] : 0
    current = currentObject ? currentObject[property] : 0

    if (start && current) {
      change = current - start
    }

    return { startEntry: startObject, start, current, change }
  }

  private calculateRowFill(
    value: number,
    property: 'bmi' | 'bodyFatPercentage'
  ): string {
    let color: string
    value = +value
    switch (property) {
      case 'bmi':
        if (value <= 24.9) {
          color = '#0bde51'
        } else if (value > 24.9 && value <= 29.9) {
          color = '#edd51c'
        } else {
          color = '#de123e'
        }
        break

      case 'bodyFatPercentage':
        if (value <= 17.9) {
          color = '#0bde51'
        } else if (value > 17.9 && value <= 24.9) {
          color = '#edd51c'
        } else {
          color = '#de123e'
        }
        break
    }

    return color
  }

  private createForm(): void {
    this.form = this.fb.group({
      provider: [null, Validators.required]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(
        (controls) =>
          (this.selectedProvider = this.providers[controls.provider])
      )
  }

  private fetchColors(): void {
    this.store.pipe(select(paletteSelector)).subscribe((palette) => {
      this.pdfColor =
        (palette.theme === 'accent' ? palette.accent : palette.primary) ||
        this.pdfColor
    })
  }

  private resolveProviders(answers: any[]): PDFProvider[] {
    const providers = []

    answers.forEach((answerObj) => {
      const provider: PDFProvider = {
        firstName: answerObj.answers[0].response.value,
        lastName: answerObj.answers[1].response.value,
        practice: answerObj.answers[2].response.value,
        fax: answerObj.answers[3].response.value
      }

      if (
        !providers.find(
          (p) =>
            p.firstName === provider.firstName &&
            p.lastName === provider.lastName
        )
      ) {
        providers.push(provider)
      }
    })

    return providers
  }
}
