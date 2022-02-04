import { DatePipe } from '@angular/common'
import { Injectable } from '@angular/core'
import {
  Form,
  FormQuestion,
  FormSection,
  FormSubmission
} from '@app/shared/model'
import { _, TranslationsObject } from '@coachcare/common/shared'
import {
  FormAnswer,
  FormSubmissionSingle,
  Form as CcrFormService,
  FormSubmission as SelveraFormSubmissionService,
  AccountProvider
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'

import * as pdfMake from 'pdfmake'
import { environment } from '../../environments/environment'
import { ContextService, SelectedOrganization } from './context.service'
import { NotifierService } from './notifier.service'

interface PDFText {
  text: string
  bold?: boolean
  decoration?: string
}
interface PDFContent {
  text?: string | PDFText[]
  style?: string
  table?: PDFTable
  columns?: PDFColumn[]
}

interface PDFTable {
  widths: string[]
  heights: number[]
  body: PDFTableBody[][]
}

interface PDFTableBody {
  text: string
  style: string
}

interface PDFColumn {
  width?: number | string
  canvas?: PDFCanvas[]
  text?: string
  style?: string
}

interface PDFCanvas {
  type: string
  x: number
  y: number
  w: number
  h: number
  r: number
  lineWidth: number
  color?: string
}

@Injectable({ providedIn: 'root' })
@UntilDestroy()
export class FormPDFService {
  private i18n: TranslationsObject

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private notifier: NotifierService,
    private formService: CcrFormService,
    private formSubmission: SelveraFormSubmissionService,
    private translator: TranslateService,
    private datePipe: DatePipe
  ) {
    this.translate()
    this.translator.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.translate())
  }

  async generatePDF(formSubmission: FormSubmission): Promise<void> {
    try {
      const { form, submission, organization } =
        await this.getFormSubmissionData(formSubmission)

      await this.generatePdf(form, submission, organization)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private translate(): void {
    this.translator
      .get([
        _('GLOBAL.DATE'),
        _('LIBRARY.FORMS.FIRST_NAME'),
        _('LIBRARY.FORMS.LAST_NAME'),
        _('LIBRARY.FORMS.PAGE'),
        _('LIBRARY.FORMS.AT'),
        _('LIBRARY.FORMS.PATIENT'),
        _('LIBRARY.FORMS.SUBMITTED_BY'),
        _('LIBRARY.FORMS.SUBMITTED_ON'),
        _('LIBRARY.FORMS.ADDENDUMS'),
        _('LIBRARY.FORMS.NOTES'),
        _('LIBRARY.FORMS.UNANSWERED')
      ])
      .subscribe((translations) => (this.i18n = translations))
  }

  private async getFormSubmissionData(formSubmission: FormSubmission): Promise<{
    form: Form
    submission: FormSubmissionSingle
    organization: SelectedOrganization
  }> {
    const opts: any = {
      organization: this.context.organization.id,
      inServer: true
    }

    try {
      const form = new Form(
        await this.formService.getSingle({
          id: formSubmission.form.id,
          full: true
        }),
        opts
      )

      const submission = await this.formSubmission.getSingle({
        id: formSubmission.id
      })

      const organization = await this.context.getOrg(submission.organization.id)

      return {
        form,
        submission,
        organization
      }
    } catch (err) {
      this.notifier.error(_('NOTIFY.ERROR.FORM_NO_ACCESS_VIEW_SUBMISSION'))

      throw err
    }
  }

  private async generatePdf(
    form: Form,
    submission: FormSubmissionSingle,
    organization: SelectedOrganization
  ): Promise<void> {
    const pageText = this.i18n['LIBRARY.FORMS.PAGE']
    const logo = await this.getLogoImage(organization)

    const doc = {
      pageSize: 'Letter',
      pageOrientation: 'portrait',
      pageMargins: [20, 70, 20, 40],
      header: (currentPage, pageCount) =>
        this.generatePdfHeader(currentPage, submission, organization, logo),
      footer: function (currentPage, pageCount) {
        return {
          text: `${pageText} ${currentPage}`,
          alignment: 'right',
          margin: [20, 10]
        }
      },
      content: await this.generatePdfContent(form, submission),
      defaultStyle: {
        fontSize: 11
      },
      styles: {
        title: {
          fontSize: 17,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        section: {
          margin: [0, 12, 0, 8]
        },
        question: {
          margin: [0, 8, 0, 3],
          bold: true
        },
        answer: {
          margin: [0, 4],
          bold: false
        },
        unanswered: {
          alignment: 'right',
          margin: [0, 8, 0, 3],
          italics: true,
          bold: false
        },
        addendum: {
          margin: [0, 4]
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          alignment: 'center',
          margin: [0, 3]
        }
      }
    }

    pdfMake.createPdf(doc).open()
  }

  private async getLogoImage(
    organization: SelectedOrganization
  ): Promise<string> {
    if (!organization) {
      return
    }

    try {
      const image = await this.getBase64ImageFromURL(
        `${environment.awsAssetsUrl}/${organization.id}_logo.png`
      )

      return image
    } catch (err) {
      // just return instead of throws error for non-block generate PDF
      return
    }
  }

  private generatePdfHeader(
    page: number,
    submission: FormSubmissionSingle,
    organization: SelectedOrganization,
    logo?: string
  ): pdfMake.Header {
    const orgName = `${organization.name} (ID ${organization.id})`
    const partientName = `${submission.account.firstName} ${submission.account.lastName}`
    const submittedBy = `${submission.submittedBy.firstName} ${submission.submittedBy.lastName}`
    const submittedAtDate = this.datePipe.transform(
      submission.createdAt,
      'MMM dd, yy'
    )
    const submittedAtTime = this.datePipe.transform(
      submission.createdAt,
      'h:mm a'
    )
    const submittedAt = `${submittedAtDate} ${this.i18n['LIBRARY.FORMS.AT']} ${submittedAtTime}`

    if (page > 1) {
      return {
        text: ''
      }
    }

    const headerLeft = []

    if (logo) {
      headerLeft.push({
        image: logo,
        width: 130
      })
    }

    headerLeft.push({ text: orgName })

    return {
      margin: [20, 10],
      columns: [
        {
          width: '*',
          stack: headerLeft
        },
        {
          width: 'auto',
          stack: [
            {
              text: [
                `${this.i18n['LIBRARY.FORMS.PATIENT']}  `,
                { text: partientName, bold: true }
              ],
              margin: [0, 2]
            },
            {
              text: [
                `${this.i18n['LIBRARY.FORMS.SUBMITTED_BY']}  `,
                { text: submittedBy, bold: true }
              ],
              margin: [0, 2]
            },
            {
              text: [
                `${this.i18n['LIBRARY.FORMS.SUBMITTED_ON']}  `,
                { text: submittedAt, bold: true }
              ],
              margin: [0, 2]
            }
          ]
        }
      ]
    }
  }

  private async generatePdfContent(
    form: Form,
    submission: FormSubmissionSingle
  ): Promise<pdfMake.Content> {
    const content = []

    content.push({ text: form.name, style: 'title' })
    content.push({
      canvas: [
        {
          type: 'line',
          x1: -20,
          y1: 0,
          x2: 595,
          y2: 0,
          lineWidth: 2
        }
      ]
    })

    const isShowHeader = form.sections.length >= 2

    form.sections.forEach((section) => {
      content.push(
        this.loadFormSection(section, submission.answers, isShowHeader)
      )
    })

    if (submission.addendums && submission.addendums.length) {
      const addendumsContent = []
      for (const addendum of submission.addendums) {
        const account = await this.account.getSingle(addendum.account.id)

        addendumsContent.push([
          {
            text: this.datePipe.transform(addendum.createdAt, 'M/d/yyyy'),
            style: 'addendum'
          },
          { text: account.firstName, style: 'addendum' },
          { text: account.lastName, style: 'addendum' },
          { text: addendum.content, style: 'addendum' }
        ])
      }

      content.push({
        style: 'section',
        layout: 'noBorders',
        table: {
          widths: ['*'],
          headerRows: 0,
          body: [
            [
              {
                fillColor: '#eeeeee',
                text: this.i18n['LIBRARY.FORMS.ADDENDUMS'],
                style: 'sectionHeader'
              }
            ],
            [
              {
                layout: 'lightHorizontalLines', // optional
                margin: [0, 10],
                table: {
                  headerRows: 1,
                  widths: ['auto', 100, 100, '*'],
                  heights: 20,
                  body: [
                    [
                      this.i18n['GLOBAL.DATE'],
                      this.i18n['LIBRARY.FORMS.FIRST_NAME'],
                      this.i18n['LIBRARY.FORMS.LAST_NAME'],
                      this.i18n['LIBRARY.FORMS.NOTES']
                    ],
                    ...addendumsContent
                  ]
                }
              }
            ]
          ]
        }
      })
    }

    return content
  }

  private loadFormSection(
    section: FormSection,
    answers: FormAnswer[],
    isShowHeader: boolean
  ): pdfMake.Content {
    const questions = section.questions.map((question) =>
      this.loadFormSectionContent(question, answers)
    )

    const contents = []

    if (isShowHeader) {
      contents.push([
        {
          fillColor: '#eeeeee',
          text: section.title,
          style: 'sectionHeader'
        }
      ])
    }

    contents.push([
      {
        stack: [
          {
            bold: true,
            ol: questions
          }
        ]
      }
    ])

    return {
      style: 'section',
      layout: 'noBorders',
      table: {
        widths: ['*'],
        headerRows: 0,
        body: contents
      }
    }
  }

  private loadFormSectionContent(
    question: FormQuestion,
    answers: FormAnswer[]
  ): pdfMake.Content {
    const answer = answers.find(
      (item) =>
        typeof item.question === 'object' && item.question.id === question.id
    )

    const questionContent: PDFColumn[] = [
      {
        width: '*',
        text: question.title,
        style: 'question'
      }
    ]

    const contents: PDFContent[] = [{ columns: questionContent }]

    if (
      question.questionType.name === 'text' ||
      question.questionType.name === 'content'
    ) {
      return contents
    }

    if (!answer) {
      questionContent.push({
        text: this.i18n['LIBRARY.FORMS.UNANSWERED'],
        style: 'unanswered'
      })

      return contents
    }

    if (
      question.questionType.name === 'short' ||
      question.questionType.name === 'long'
    ) {
      const height = !answer && question.questionType.name === 'long' ? 60 : 20

      contents.push({
        table: {
          widths: ['*'],
          heights: [height],
          body: [[{ text: answer?.response?.value || '', style: 'answer' }]]
        }
      })
    }

    if (
      question.questionType.name === 'radios' ||
      question.questionType.name === 'checkboxes' ||
      question.questionType.name === 'select'
    ) {
      question.allowedValues.forEach((value) => {
        const radius = question.questionType.name === 'checkboxes' ? 0 : 7
        const isSelected =
          typeof answer?.response?.value === 'object'
            ? answer.response.value.includes(value)
            : answer?.response?.value === value

        const canvas: PDFCanvas[] = [
          {
            type: 'rect',
            x: 0,
            y: 4,
            w: 14,
            h: 14,
            r: radius,
            lineWidth: 1
          }
        ]

        if (isSelected) {
          canvas.push({
            type: 'rect',
            x: 3,
            y: 7,
            w: 8,
            h: 8,
            r: radius,
            color: 'black',
            lineWidth: 1
          })
        }
        contents.push({
          columns: [
            {
              width: 25,
              canvas
            },
            { text: value, style: 'answer' }
          ]
        })
      })
    }

    if (question.questionType.name === 'scale') {
      contents.push({
        style: 'answer',
        text: question.allowedValues.map((value) => {
          const isSelected = answer?.response?.value === value
          return {
            text: ` ${value} `,
            bold: isSelected ? true : false,
            decoration: isSelected ? 'underline' : undefined
          }
        })
      })
    }

    return contents
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
      }
      img.onerror = (error) => {
        reject(error)
      }
      img.src = url
    })
  }
}
