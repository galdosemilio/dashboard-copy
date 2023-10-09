import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store'
import {
  ContextService,
  SequencesDatabase,
  SequencesDataSource
} from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-sequencing-sequences',
  templateUrl: './sequences.component.html'
})
export class SequencesComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  searchControl: FormControl
  source: SequencesDataSource
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/sections/360007119132-Sequences'

  constructor(
    private context: ContextService,
    private database: SequencesDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<UILayoutState>
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
  }

  ngOnInit(): void {
    this.store.dispatch(new ClosePanel())
    this.createDataSource()
    this.createFormControl()
  }

  createSequence(): void {
    void this.router.navigate(['new'], { relativeTo: this.route })
  }

  private createDataSource(): void {
    this.source = new SequencesDataSource(this.database, this.paginator)
    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId
    }))
  }

  private createFormControl(): void {
    this.searchControl = new FormControl()
    this.source.addOptional(
      this.searchControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        untilDestroyed(this)
      ),
      () => ({
        query: this.searchControl.value
          ? this.searchControl.value.trim()
          : undefined
      })
    )

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), untilDestroyed(this))
      .subscribe(() => this.paginator.firstPage())
  }
}
