import { Component } from '@angular/core';
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store';

@Component({
  selector: 'ccr-page-register-clinic-default-last-step',
  templateUrl: './default.last-step.component.html'
})
export class DefaultLastStepComponent {
  public orgName: Partial<OrgPrefState.State>;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      this.orgName = { displayName: pref.displayName || 'CoachCare' };
    });
  }

  refresh(): void {
    window.location.reload();
  }
}
