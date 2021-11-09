import { environment } from 'apps/provider/src/environments/environment'

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { ContextService } from '@app/service'
import {
  Form,
  FormSection,
  FormQuestion
} from '@app/dashboard/library/forms/models'
import { FormsDatasource } from '@app/dashboard/library/forms/services'
import { _, TranslationsObject } from '@app/shared'
import { MatDialog, Sort } from '@coachcare/material'
import { Form as CcrFormService } from '@coachcare/sdk'

import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import * as pdfMake from 'pdfmake'

import { FormCloneDialog, FormCloneDialogData } from '../dialogs'

@UntilDestroy()
@Component({
  selector: 'app-library-forms-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class FormsTableComponent {
  @Input()
  datasource: FormsDatasource

  @Output()
  onDelete: EventEmitter<Form> = new EventEmitter<Form>()
  @Output()
  onEdit: EventEmitter<Form> = new EventEmitter<Form>()
  @Output()
  onSorted: EventEmitter<Sort> = new EventEmitter<Sort>()

  public columns = [
    'name',
    'isActive',
    'addendum',
    'maximumSubmissions',
    'actions'
  ]

  private i18n: TranslationsObject

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private context: ContextService,
    private formService: CcrFormService,
    private translator: TranslateService
  ) {
    this.translate()
    this.translator.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.translate())
  }

  onCloneForm(form: Form): void {
    if (!form.isAdmin) {
      return
    }

    const data: FormCloneDialogData = {
      form
    }

    this.dialog
      .open(FormCloneDialog, { data, width: '50vw' })
      .afterClosed()
      .subscribe((refresh) => {
        if (!refresh) {
          return
        }

        this.datasource.refresh()
      })
  }

  onDisplayForm(form: Form): void {
    this.router.navigate([form.id], { relativeTo: this.route })
  }

  onDeleteForm(form: Form): void {
    if (!form.isAdmin) {
      return
    }

    this.onDelete.emit(form)
  }

  onFillForm(form: Form): void {
    this.router.navigate([form.id, 'fill'], { relativeTo: this.route })
  }

  onShowForm(form: Form): void {
    if (form.isAdmin && form.canFetchSubmissions) {
      this.router.navigate([form.id, 'edit'], { relativeTo: this.route })
    }
  }

  onViewFormSubmissions(form: Form): void {
    this.router.navigate([form.id, 'submissions'], { relativeTo: this.route })
  }

  onSort(sort: Sort): void {
    this.onSorted.emit(sort)
  }

  onEditName(form: Form) {
    if (form.isAdmin) {
      this.onEdit.emit(form)
    }
  }

  private translate(): void {
    this.translator
      .get([_('LIBRARY.FORMS.PAGE')])
      .subscribe((translations) => (this.i18n = translations))
  }

  async onGeneratePDF(form: Form) {
    const detailedForm = await this.getFormData(form)
    this.generatePdf(detailedForm)
  }

  private async getFormData(form: Form): Promise<Form> {
    const opts: any = {
      organization: this.context.organization.id,
      inServer: true
    }
    return new Form(
      await this.formService.getSingle({
        id: form.id,
        full: true
      }),
      opts
    )
  }

  private async generatePdf(form: Form): Promise<void> {
    const pageText = this.i18n['LIBRARY.FORMS.PAGE']
    const logo = await this.getLogoImage()

    const doc = {
      pageSize: 'Letter',
      pageOrientation: 'portrait',
      pageMargins: [20, 70, 20, 40],
      header: (currentPage, pageCount) =>
        this.generatePdfHeader(currentPage, logo),
      footer: function (currentPage, pageCount) {
        return {
          text: `${pageText} ${currentPage}`,
          alignment: 'right',
          margin: [20, 10]
        }
      },
      content: this.generatePdfContent(form),
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

  private async getLogoImage(): Promise<any> {
    if (!this.context.organization) {
      return
    }

    try {
      const image = await this.getBase64ImageFromURL(
        `${environment.awsAssetsUrl}/${this.context.organization.id}_logo.png`
      )

      return image
    } catch (err) {
      // just return instead of throws error for non-block generate PDF
      return
    }
  }

  private generatePdfHeader(page: number, logo?: string): pdfMake.Header {
    const orgName = `${this.context.organization.name} (ID ${this.context.organization.id})`

    if (page > 1) {
      return {
        text: ''
      }
    }

    const header = []

    if (logo) {
      header.push({
        image: logo,
        width: 130
      })
    }

    header.push({ text: orgName })

    return {
      margin: [20, 10],
      columns: [
        {
          width: '*',
          stack: header
        }
      ]
    }
  }

  private generatePdfContent(form: Form): pdfMake.Content {
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
      content.push(this.loadFormSection(section, isShowHeader))
    })

    return content
  }

  private loadFormSection(
    section: FormSection,
    isShowHeader: boolean
  ): pdfMake.Content {
    const questions = section.questions.map((question) =>
      this.loadFormSectionContent(question)
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

  private loadFormSectionContent(question: FormQuestion): pdfMake.Content {
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

      if (question.questionType.name === 'long') {
        // need to set 3 lines as default for long text
        height = 60
      }

      contents.push({
        table: {
          widths: ['*'],
          heights: [height],
          body: [[{ text: '', style: 'answer' }]]
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
          return {
            text: ` ${value} `
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
