import { environment } from 'apps/provider/src/environments/environment'

import { Component, Input } from '@angular/core'
import { DatePipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

import { MatDialog } from '@coachcare/material'
import {
  Form,
  FormQuestion,
  FormSection,
  FormSubmission
} from '@app/dashboard/library/forms/models'
import {
  FormSubmissionsDatabase,
  FormSubmissionsDatasource
} from '@app/dashboard/library/forms/services'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _, PromptDialog, TranslationsObject } from '@app/shared'
import {
  AccountProvider,
  Form as CcrFormService,
  FormAnswer,
  FormSubmissionSingle
} from '@coachcare/npm-api'

import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import * as pdfMake from 'pdfmake'

@UntilDestroy()
@Component({
  selector: 'app-library-form-submissions-table',
  templateUrl: './form-submissions-table.component.html',
  styleUrls: ['./form-submissions-table.component.scss']
})
export class FormSubmissionsTableComponent {
  @Input()
  source: FormSubmissionsDatasource

  public columns: string[] = [
    'submittedBy',
    'name',
    'organization',
    'createdAt',
    'createdAtHour',
    'actions'
  ]

  private i18n: TranslationsObject

  constructor(
    private account: AccountProvider,
    private dialog: MatDialog,
    private context: ContextService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router,
    private database: FormSubmissionsDatabase,
    private datePipe: DatePipe,
    private formService: CcrFormService,
    private translator: TranslateService
  ) {
    this.translate()
    this.translator.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.translate())
  }

  onGoToPatientProfile(formSubmission: FormSubmission) {
    if (formSubmission.account.id !== formSubmission.submittedBy.id) {
      this.router.navigate([
        '/accounts/patients/',
        formSubmission.account.id,
        'dashboard'
      ])
    }
  }

  async onGoToProviderProfile(formSubmission: FormSubmission) {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      const acc = await this.account.getSingle(formSubmission.submittedBy.id)

      if (acc.id === this.context.user.id) {
        this.router.navigate(['/profile'])
        return
      }

      const res = await this.account.getList({
        accountType: acc.accountType.id,
        organization: this.context.organizationId,
        query: acc.email
      })
      const account = res.data.find((a) => a.email === acc.email)
      if (account) {
        switch (account.accountType.id) {
          case '2':
            this.router.navigate([
              '/accounts/coaches/',
              formSubmission.submittedBy.id,
              'profile'
            ])
            break

          case '3':
            this.router.navigate([
              '/accounts/patients/',
              formSubmission.submittedBy.id,
              'dashboard'
            ])
            break
        }
      } else {
        this.notifier.error(_('NOTIFY.ERROR.ACCOUNT_NO_ACCESS_PERMISSION'))
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  onRemoveSubmission(formSubmission: FormSubmission): void {
    if (!formSubmission.canRemoveSubmission) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('LIBRARY.FORMS.REMOVE_SUBMISSION'),
          content: _('LIBRARY.FORMS.REMOVE_SUBMISSION_DESCRIPTION')
        }
      })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (confirm) {
            await this.source.removeSubmission({ id: formSubmission.id })
            this.source.refresh()
          }
        } catch (error) {
          this.notifier.error(error)
        }
      })
  }

  onViewForm(formSubmission: FormSubmission): void {
    this.router.navigate([formSubmission.id], { relativeTo: this.route })
  }

  async onGeneratePDF(formSubmission: FormSubmission): Promise<void> {
    const { form, submission, organization } = await this.getFormSubmissionData(
      formSubmission
    )

    await this.generatePdf(form, submission, organization)
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
        _('LIBRARY.FORMS.NOTES')
      ])
      .subscribe((translations) => (this.i18n = translations))
  }

  private async getFormSubmissionData(
    formSubmission: FormSubmission
  ): Promise<{
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

      const submission = await this.database
        .fetchAnswers({ id: formSubmission.id })
        .toPromise()

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
          margin: [0, 8, 0, 3]
        },
        answer: {
          margin: [0, 4]
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

    const contents: any = [{ text: question.title, style: 'question' }]

    if (
      question.questionType.name === 'text' ||
      question.questionType.name === 'content'
    ) {
      return contents
    }

    if (
      question.questionType.name === 'short' ||
      question.questionType.name === 'long'
    ) {
      let height = 20

      if (!answer && question.questionType.name === 'long') {
        // need to set 3 lines as default in long text if there's no answer
        height = 60
      }

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

        const canvas: any = [
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
