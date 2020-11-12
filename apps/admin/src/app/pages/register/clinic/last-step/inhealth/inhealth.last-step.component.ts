import { Component } from '@angular/core'
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store'

@Component({
  selector: 'ccr-page-register-clinic-inhealth-last-step',
  templateUrl: './inhealth.last-step.component.html'
})
export class InHealthLastStepComponent {
  orgName: Partial<OrgPrefState.State>

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe((pref) => {
      this.orgName = { displayName: pref.displayName || 'CoachCare' }
    })
  }
}
