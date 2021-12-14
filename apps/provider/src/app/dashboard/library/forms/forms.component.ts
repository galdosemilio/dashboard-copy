import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog, MatSort, Sort } from '@coachcare/material'
import { ActivatedRoute, Router } from '@angular/router'
import {
  FormCreateDialog,
  FormEditDialog
} from '@app/dashboard/library/forms/dialogs'
import { Form } from '@app/dashboard/library/forms/models'
import {
  FormsDatabase,
  FormsDatasource
} from '@app/dashboard/library/forms/services'
import { ContextService, NotifierService } from '@app/service'
import { _, PromptDialog } from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { CreateFormRequest, UpdateFormRequest } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public datasource: FormsDatasource
  public form: FormGroup
  public userIsAdmin: boolean
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360022496331-Quick-Overview-of-Forms'

  private refresh$: Subject<void> = new Subject<void>()
  private sort: MatSort = new MatSort()

  constructor(
    private context: ContextService,
    private database: FormsDatabase,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()
    this.createDatasource()
  }

  async onEdit(form: Form) {
    if (!this.userIsAdmin) {
      return
    }

    this.dialog
      .open(FormEditDialog, {
        autoFocus: false,
        data: form,
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(filter((args) => args))
      .subscribe(async (args: UpdateFormRequest) => {
        await this.datasource.updateForm(
          Object.assign(args, {
            maximumSubmissions: args.maximumSubmissions ? 1 : null,
            id: form.id
          }) as UpdateFormRequest
        )
        this.notifier.success(_('NOTIFY.SUCCESS.FORM_UPDATED'))
        this.datasource.refresh()
      })
  }

  onSorted(sort: Sort): void {
    this.sort.active = sort.active
    this.sort.direction = sort.direction
    this.sort.sortChange.emit(sort)
  }

  public addForm(): void {
    if (!this.userIsAdmin) {
      return
    }

    this.dialog
      .open(FormCreateDialog, {
        autoFocus: false,
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(filter((args) => args))
      .subscribe(async (args: CreateFormRequest) => {
        try {
          const res = await this.datasource.createForm(
            Object.assign(args, {
              maximumSubmissions: args.maximumSubmissions ? 1 : undefined,
              organization: this.context.organization.id
            }) as CreateFormRequest
          )

          void this.router.navigate([res.id, 'edit'], {
            relativeTo: this.route
          })
          this.notifier.success(_('NOTIFY.SUCCESS.FORM_CREATED'))
          this.paginator.firstPage()
          this.datasource.refresh()
        } catch (error) {
          this.notifier.error(error)
          this.paginator.firstPage()
          this.datasource.refresh()
        }
      })
  }

  public onDelete(form: Form): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('LIBRARY.FORMS.FORM_DELETE_TITLE'),
          content: _('LIBRARY.FORMS.FORM_DELETE_CONTENT')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(async () => {
        try {
          await this.datasource.deleteForm(form)
          this.notifier.success(_('NOTIFY.SUCCESS.FORM_DELETED'))
          this.paginator.firstPage()
          this.datasource.refresh()
        } catch (error) {
          this.notifier.error(error)
        }
      })
  }

  private createDatasource(): void {
    this.datasource = new FormsDatasource(
      this.context,
      this.database,
      this.notifier,
      this.paginator
    )

    this.datasource.addRequired(this.context.organization$, () => ({
      organization: this.context.organization.id
    }))

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        this.userIsAdmin = await this.context.orgHasPerm(
          this.context.organization.id,
          'admin'
        )
        this.paginator.firstPage()
      })

    this.form.valueChanges
      .pipe(debounceTime(700))
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.paginator.firstPage()
        this.refresh$.next()
      })

    this.datasource.addOptional(this.refresh$, () => ({
      query: this.form.value.name || undefined
    }))
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      name: ['']
    })
  }
}
