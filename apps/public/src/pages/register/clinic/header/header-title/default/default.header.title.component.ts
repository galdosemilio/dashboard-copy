import { Component } from '@angular/core';
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store';

@Component({
  selector: 'ccr-register-clinic-default-header-title',
  templateUrl: './default.header.title.component.html'
})
export class DefaultHeaderTitleComponent {
  public orgName: Partial<OrgPrefState.State>;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      this.orgName = { displayName: pref.displayName || 'CoachCare' };
    });
  }
}
