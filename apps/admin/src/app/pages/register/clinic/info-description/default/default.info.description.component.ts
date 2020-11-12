import { Component } from '@angular/core'
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store'

@Component({
  selector: 'ccr-register-clinic-default-info-description',
  templateUrl: './default.info.description.component.html'
})
export class DefaultInfoDescriptionComponent {
  public orgName: Partial<OrgPrefState.State>

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe((pref) => {
      this.orgName = { displayName: pref.displayName || 'CoachCare' }
    })
  }
}
