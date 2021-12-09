import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { Form, FormSubmission } from '@app/dashboard/library/forms/models'
import {
  FormDisplayService,
  FormsDatabase,
  FormSubmissionsDatabase,
  FormSubmissionsDatasource
} from '@app/dashboard/library/forms/services'
import { ContextService, NotifierService } from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { FormAnswer, FormSingle } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { filter, map, take } from 'rxjs/operators'
import { AssignFormDialog } from '../dialogs'
import { ActivatedRoute, Router } from '@angular/router'

@UntilDestroy()
@Component({
  selector: 'app-library-dieter-submissions',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class DieterSubmissionsComponent implements OnInit {
  @Input()
  set fillForm(form: Form) {
    if (form) {
      this.selectedForm = form
      this.answers = []
      this.selectedSubmission = undefined
      this.readonly = false
      this.fill = true
      this.account = this.context.account
      this.showcase = false
    }
  }

  public initialOrg: any
  public organization: any
  public organization$: EventEmitter<void> = new EventEmitter<void>()
  showcase = true

  @Output()
  formSelected: EventEmitter<Form> = new EventEmitter<Form>()

  @ViewChild(CcrPaginatorComponent, { static: true }) paginator

  public account: any
  public answers: FormAnswer[]
  public isProvider: boolean
  public fill = false
  public form: FormGroup
  public forms: Form[] = []
  public hasCalculatedLimit: boolean
  public hasReachedSubmissionLimit: boolean
  public readonly = true
  public source: FormSubmissionsDatasource
  public selectedSubmission: FormSubmission
  public set selectedForm(form: Form) {
    this._selectedForm = form
    setTimeout(() => this.formSelected.emit(form))
  }

  public get selectedForm(): Form {
    return this._selectedForm
  }

  private _formFilter: string
  set formFilter(filter: string) {
    if (typeof filter === 'string' || filter === undefined) {
      this._formFilter = filter
      this.formFilterChange$.next()
      this.paginator.firstPage()
    }
  }

  get formFilter(): string {
    return this._formFilter
  }
  private formFilterChange$: Subject<string> = new Subject<string>()
  private formId: string
  private _selectedForm: Form
  private autoAssignForm: boolean

  constructor(
    private context: ContextService,
    private database: FormSubmissionsDatabase,
    private dialog: MatDialog,
    private formDisplay: FormDisplayService,
    private formsDatabase: FormsDatabase,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.autoAssignForm = !!this.router.getCurrentNavigation().extras.state
      ?.autoAssignForm
  }

  ngOnInit() {
    this.isProvider = this.context.isProvider
    this.initialOrg = this.context.organization
    this.createDatasource()

    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((map) => {
      this.formId = map.get('id')

      if (this.isProvider) {
        return
      }

      this.source
        .connect()
        .pipe(take(1))
        .subscribe(() => void this.resolveSubmissionLimit(this.formId))

      this.formFilter = this.formId
    })

    this.formDisplay.saved$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.showSubmissions())
  }

  async onSelectSubmission(submission: FormSubmission) {
    try {
      this.source.isLoading = true
      this.source.change$.next()

      const opts: any = {
        organization: this.context.organization.id,
        inServer: true
      }

      const responses = await Promise.all([
        this.formsDatabase
          .readForm({ id: submission.form.id, full: true })
          .pipe(map((form: FormSingle) => new Form(form, opts)))
          .toPromise(),
        this.database.fetchAnswers({ id: submission.id }).toPromise()
      ])

      this.selectedSubmission = submission
      this.selectedForm = responses[0]
      this.answers = responses[1].answers
      this.fill = false
      this.readonly = true
      this.account = undefined
      this.showcase = true
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  public onOrganizationSelect($event: any): void {
    if ($event && $event.id) {
      this.organization = $event
      this.organization$.next()
      this.paginator.firstPage()
    } else if ($event === undefined) {
      this.organization = undefined
      this.organization$.next()
      this.paginator.firstPage()
    }
  }

  searchBarDisplayWith(value: any): string {
    const selectedForm: Form =
      this.forms && this.forms.length
        ? this.forms.find((form: Form) => form.id === value)
        : undefined
    return selectedForm ? selectedForm.name : value
  }

  showSubmissions() {
    this.selectedForm = undefined
    delete this.answers
    this.source.refresh()
  }

  private createDatasource() {
    this.source = new FormSubmissionsDatasource(this.database, this.paginator)
    this.source.addRequired(this.context.account$, () => ({
      account: this.context.accountId,
      organization: this.context.organization.id
    }))
    this.source.addOptional(this.formFilterChange$, () => ({
      form: this.formFilter
    }))
    this.source.addOptional(this.organization$, () => ({
      organization: this.organization
        ? this.organization.id
        : this.context.organizationId
    }))
  }

  assignForm() {
    if (!this.isProvider) {
      void this.resolveFillForm(this.formId)
      return
    }

    this.dialog
      .open(AssignFormDialog, {
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter(($event) => $event.form)
      )
      .subscribe(($event) => void this.resolveFillForm($event.form))
  }

  private async resolveFillForm(formId: string): Promise<void> {
    try {
      this.formsDatabase
        .readForm({ id: formId, full: true })
        .pipe(untilDestroyed(this))
        .subscribe(
          (response: FormSingle) => (this.fillForm = new Form(response))
        )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveSubmissionLimit(formId: string): Promise<void> {
    try {
      const form = await this.formsDatabase
        .readForm({ id: formId, full: this.autoAssignForm })
        .pipe(untilDestroyed(this))
        .toPromise()

      if (this.autoAssignForm) {
        this.fillForm = new Form(form)
      }

      if (!form.maximumSubmissions) {
        this.hasReachedSubmissionLimit = false
        return
      }

      this.hasReachedSubmissionLimit = this.source.result.length > 0

      this.onSelectSubmission(this.source.result[0])
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
