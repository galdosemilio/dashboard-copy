import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { CSV } from '@coachcare/common/shared'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { Form, FormSubmission } from '@app/shared/model/form'
import {
  FormSubmissionsDatabase,
  FormSubmissionsDatasource
} from '@app/service/forms'

@UntilDestroy()
@Component({
  selector: 'app-library-form-submissions',
  templateUrl: './form-submissions.component.html'
})
export class FormSubmissionsComponent implements OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public canSeeSubmissions = false
  public currentOrg: SelectedOrganization
  public hasSubmissions = false
  public source: FormSubmissionsDatasource
  public title: string

  private csvSeparator = ','
  private dates: { after: string; before: string }
  private dates$: EventEmitter<void> = new EventEmitter<void>()
  private form: Form
  private formId: string
  private organization: any
  private organization$: EventEmitter<void> = new EventEmitter<void>()

  constructor(
    private context: ContextService,
    private database: FormSubmissionsDatabase,
    private notify: NotifierService,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe((data: any) => {
      this.form = data.form
      this.formId = data.form.id
      this.title = data.form.name
    })
  }

  public ngOnInit(): void {
    this.source = new FormSubmissionsDatasource(this.database, this.paginator)
    this.source.addDefault({
      form: this.formId,
      organization: this.context.organization.id
    })

    this.source.addOptional(this.dates$, () => ({
      createdAt: { ...this.dates }
    }))
    this.source.addOptional(this.organization$, () => ({
      organization: this.organization
        ? this.organization.id
        : this.context.organizationId
    }))

    this.source
      .connect()
      .pipe(untilDestroyed(this), debounceTime(100))
      .subscribe(
        (submissions) => (this.hasSubmissions = submissions.length > 0)
      )

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.currentOrg = org
      this.canSeeSubmissions =
        this.currentOrg.permissions.viewAll &&
        this.currentOrg.permissions.allowClientPhi
    })
  }

  public async onGenerateCSV() {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      const headers = [
        '"Submitter ID"',
        '"Submitter Name"',
        '"Patient ID"',
        '"Patient Name"',
        '"Organization"',
        '"Date"',
        '"Time"'
      ]
      const questions = []
      let submissions: FormSubmission[] = (
        await this.database
          .fetch({
            answers: true,
            form: this.formId,
            organization: this.context.organizationId,
            createdAt: this.dates || undefined,
            limit: 'all',
            offset: 0
          })
          .toPromise()
      ).data.map((rawSubmission) => new FormSubmission(rawSubmission))
      let answers = submissions.map((submission) => submission.answers)
      submissions = submissions.filter((submission, index) => answers[index])

      answers = answers.filter((answer) => answer)
      let csv = ''

      this.form.sections.forEach((section) => {
        section.questions.forEach((question) => {
          questions.push(question)
          headers.push(`"${question.title}"`)
        })
      })

      csv += `"${this.title}"\r\n`
      csv += `${headers.join(this.csvSeparator)}\r\n`

      submissions.forEach((submission: any, index) => {
        csv += `"${submission.submittedBy.id}"${this.csvSeparator}`
        csv += `"${submission.submittedBy.firstName} ${submission.submittedBy.lastName}"${this.csvSeparator}`
        csv += `"${submission.account.id}"${this.csvSeparator}`
        csv += `"${submission.account.firstName} ${submission.account.lastName}"${this.csvSeparator}`
        csv += `"${submission.organization.name}"${this.csvSeparator}`
        csv += `"${moment(submission.createdAt).format('ddd, MMM D YYYY')}"${
          this.csvSeparator
        }`
        csv += `"${moment(submission.createdAt).format('h:mm a')}"${
          this.csvSeparator
        }`

        const answer: any = answers[index]

        this.form.sections.forEach((section) => {
          section.questions.forEach((question, questionIndex) => {
            const ans = answer.find((a) => a.question.id === question.id)

            csv += `"${(ans && ans.response.value) || ' '}"${
              questionIndex >= section.questions.length - 1
                ? ''
                : this.csvSeparator
            }`
          })
        })

        csv += `\r\n`
      })

      CSV.toFile({
        filename: this.title,
        content: csv
      })
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  public onOrganizationSelect($event: any): void {
    if ($event && $event.id) {
      this.organization = $event
      this.organization$.next()
    } else if ($event === undefined) {
      this.organization = undefined
      this.organization$.next()
    }
  }

  public updateDates($event: any): void {
    this.dates = {
      after: moment($event.startDate).startOf('day').toISOString(),
      before: moment($event.endDate).endOf('day').toISOString()
    }
    this.dates$.next()
  }
}
