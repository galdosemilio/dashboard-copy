import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { AssignFormDialog } from '@app/dashboard/accounts/dialogs'
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
import { map } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-dieter-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class DieterFormsComponent implements OnInit, OnDestroy {
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
  public defaultForm: Form
  public fill = false
  public form: FormGroup
  public forms: Form[] = []
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
  private _selectedForm: Form

  constructor(
    private context: ContextService,
    private database: FormSubmissionsDatabase,
    private dialog: MatDialog,
    private formDisplay: FormDisplayService,
    private formsDatabase: FormsDatabase,
    private notifier: NotifierService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.initialOrg = this.context.organization
    this.createDatasource()
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
    if (this.defaultForm) {
      this.fillForm = this.defaultForm
    } else {
      this.dialog
        .open(AssignFormDialog, {
          width: '80vw',
          panelClass: 'ccr-full-dialog'
        })
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(($event: any) => {
          if ($event.form) {
            this.formsDatabase
              .readForm({ id: $event.form, full: true })
              .pipe(untilDestroyed(this))
              .subscribe((response: FormSingle) => {
                this.fillForm = new Form(response)
              })
          }
        })
    }
  }
}
