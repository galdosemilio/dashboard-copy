import { Component, Inject, OnInit } from '@angular/core';
import { PageSectionInjectableProps } from '@board/pages/shared/model';
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store';
import { LastStepComponentProps } from '../model';

@Component({
  selector: 'ccr-page-register-clinic-default-last-step',
  templateUrl: './default.last-step.component.html'
})
export class DefaultLastStepComponent implements OnInit {
  public data: LastStepComponentProps = { onlyFirstParagraph: false };
  public orgName: Partial<OrgPrefState.State>;

  constructor(
    @Inject(PageSectionInjectableProps) private injectedData: PageSectionInjectableProps,
    private org: AppStoreFacade
  ) {
    this.org.pref$.subscribe(pref => {
      this.orgName = { displayName: pref.displayName || 'CoachCare' };
    });
  }

  public ngOnInit(): void {
    this.data = this.injectedData.data;
  }

  public refresh(): void {
    window.location.reload();
  }
}
