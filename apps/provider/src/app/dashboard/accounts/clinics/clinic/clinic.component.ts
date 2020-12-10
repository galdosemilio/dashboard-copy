import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store'
import { ContextService } from '@app/service'
import { OrgSingleResponse } from '@coachcare/npm-api'
import { Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

type ClinicComponentSection = 'info' | 'phases' | 'settings'

@UntilDestroy()
@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicComponent implements OnDestroy, OnInit {
  public clinic: OrgSingleResponse
  public section: ClinicComponentSection = 'info'

  constructor(
    private context: ContextService,
    private route: ActivatedRoute,
    private store: Store<UILayoutState>
  ) {}

  public ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
  }

  public ngOnInit(): void {
    this.store.dispatch(new ClosePanel())

    this.context.clinic$
      .pipe(untilDestroyed(this))
      .subscribe((clinic) => (this.clinic = clinic))

    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe((params: ParamMap) => {
        const s = params.get('s') || 'info'
        this.section = s as ClinicComponentSection
      })
  }
}
