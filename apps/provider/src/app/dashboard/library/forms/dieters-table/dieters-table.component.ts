import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DietersDatabase, DietersDataSource } from '@app/dashboard/accounts'
import { ContextService, NotifierService } from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { AccountAccessData } from '@coachcare/sdk'
import { debounceTime, delay } from 'rxjs/operators'

@Component({
  selector: 'app-library-forms-dieters-table',
  templateUrl: './dieters-table.component.html'
})
export class DietersTableComponent implements OnInit {
  @Output()
  onSelect: EventEmitter<AccountAccessData> = new EventEmitter<AccountAccessData>()
  @ViewChild(CcrPaginatorComponent, { static: false }) paginator

  public columns: string[] = ['firstName', 'lastName', 'email', 'created']
  public form: FormGroup
  public source: DietersDataSource

  constructor(
    private context: ContextService,
    private database: DietersDatabase,
    private formBuilder: FormBuilder,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.createDatasource()
  }

  onSelected(dieter: AccountAccessData): void {
    this.onSelect.emit(dieter)
  }

  private createDatasource(): void {
    this.source = new DietersDataSource(
      this.notifier,
      this.database,
      this.paginator
    )
    this.source.pageSize = 4

    const onSearchChange = this.form.controls.query.valueChanges.pipe(
      debounceTime(700)
    )

    onSearchChange.subscribe(() => this.paginator.firstPage())

    this.source.addOptional(onSearchChange, () => ({
      query: this.form.value.query || undefined
    }))

    this.source.addRequired(
      this.context.organization$.pipe(delay(100)),
      () => ({
        organization: this.context.organizationId
      })
    )
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      query: []
    })
  }
}
