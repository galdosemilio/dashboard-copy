import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { resolveConfig } from '@app/config/section'
import { FormSubmission } from '@app/dashboard/library/forms/models'
import {
  FormSubmissionsDatabase,
  FormSubmissionsDatasource
} from '@app/dashboard/library/forms/services'
import { ContextService, NotifierService } from '@app/service'
import { ConsultationListingResponse, NamedEntity } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { FormSubmission as FormSubmissionService } from '@coachcare/npm-api'

export interface LayoutNote extends ConsultationListingResponse {
  isDeletable?: boolean
  organization?: NamedEntity
  submissionId?: string
}

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-notes-container',
  templateUrl: './notes-container.component.html',
  styleUrls: ['./notes-container.component.scss']
})
export class NotesContainerComponent implements OnDestroy, OnInit {
  @Input() refresh$: Subject<string> = new Subject<string>()

  set formId(id: string) {
    this._formId = id
    this.formId$.next(id)
  }

  get formId(): string {
    return this._formId
  }

  public formId$: Subject<string> = new Subject<string>()
  public isSearchingNotes: boolean
  public notes: Array<LayoutNote> = []
  public submissionSource: FormSubmissionsDatasource

  private _formId: string
  private notesPageSize = 10
  private notesSearchNext: number
  private notesSubject: Subject<void> = new Subject<void>()

  constructor(
    private context: ContextService,
    private formSubmission: FormSubmissionsDatabase,
    private formSubmissionService: FormSubmissionService,
    private notifier: NotifierService
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.notesSearchNext = 0
        this.notes = []
        this.formId = resolveConfig('RIGHT_PANEL.REMINDERS_FORM', organization)
      })

    this.refresh$.subscribe(async (submissionId) => {
      try {
        const submission = new FormSubmission(
          await this.formSubmissionService.getSingle({ id: submissionId })
        )
        this.getNotes([submission], false)
      } catch (error) {
        this.notifier.error(error)
      }
    })

    this.createSource()
  }

  public async onDeleteNote(note: LayoutNote): Promise<void> {
    try {
      const source = new FormSubmissionsDatasource(this.formSubmission)
      await source.removeSubmission({ id: note.submissionId })
      this.notifier.success(_('NOTIFY.SUCCESS.NOTE_DELETED'))
      this.notes = this.notes.filter(
        (n) => n.submissionId !== note.submissionId
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public onScroll($event): void {
    const target = $event.target as HTMLElement
    if (
      !this.isSearchingNotes &&
      this.notesSearchNext &&
      target.offsetHeight + target.scrollTop >= target.scrollHeight
    ) {
      this.isSearchingNotes = true
      this.notesSubject.next()
    }
  }

  private createSource() {
    const updateSubject = merge(
      this.context.account$,
      this.context.organization$,
      this.formId$
    )

    updateSubject.pipe(untilDestroyed(this)).subscribe(() => {
      this.notesSearchNext = 0
      this.notes = []
    })

    this.submissionSource = new FormSubmissionsDatasource(this.formSubmission)
    this.submissionSource.addDefault({ answers: true })
    this.submissionSource.addOptional(
      merge(updateSubject, this.notesSubject).pipe(debounceTime(50)),
      () => ({
        form: this.formId,
        limit: this.notesPageSize,
        offset: this.notesSearchNext,
        organization: this.context.organizationId,
        account: this.context.accountId
      })
    )

    this.submissionSource
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((submissions: FormSubmission[]) => {
        this.isSearchingNotes = false
        this.notesSearchNext = this.submissionSource.next
        this.getNotes(submissions)
      })
  }

  private async getNotes(submissions: FormSubmission[], onEnd: boolean = true) {
    if (onEnd) {
      this.notes = [
        ...this.notes,
        ...submissions.map((submission) => ({
          client: submission.account.id,
          consultationTime: submission.createdAt,
          consultationType: 'private' as 'private',
          internalNote: submission.answers[0].response.value,
          isDeletable: true,
          provider: submission.submittedBy.id,
          providerName: `${submission.submittedBy.firstName} ${submission.submittedBy.lastName}`,
          submissionId: submission.id,
          organization: submission.organization
        }))
      ]
    } else {
      this.notes = [
        ...submissions.map((submission) => ({
          client: submission.account.id,
          consultationTime: submission.createdAt,
          consultationType: 'private' as 'private',
          internalNote: submission.answers[0].response.value,
          isDeletable: true,
          provider: submission.submittedBy.id,
          providerName: `${submission.submittedBy.firstName} ${submission.submittedBy.lastName}`,
          submissionId: submission.id
        })),
        ...this.notes
      ]
    }
  }
}
