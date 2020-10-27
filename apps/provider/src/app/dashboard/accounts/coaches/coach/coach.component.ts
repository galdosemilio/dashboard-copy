import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store';
import { ContextService } from '@app/service';
import { AccSingleResponse } from '@app/shared/selvera-api';
import { Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';

type CoachComponentSection = 'profile' | 'clinics' | 'calls';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss']
})
export class CoachComponent implements OnDestroy, OnInit {
  public coach: AccSingleResponse;
  public coachId: string;
  public section: CoachComponentSection;

  constructor(
    private context: ContextService,
    private route: ActivatedRoute,
    private store: Store<UILayoutState>
  ) {}

  public ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel());
  }

  public ngOnInit(): void {
    this.store.dispatch(new ClosePanel());
    this.coachId = this.context.accountId;

    this.route.data.forEach((data: any) => {
      this.coach = data.account;
    });

    this.route.paramMap.pipe(untilDestroyed(this)).subscribe((params: ParamMap) => {
      const s = params.get('s') || 'profile';
      this.section = s as CoachComponentSection;
    });
  }
}
