import { Component } from '@angular/core'
import { AppStoreFacade } from '@coachcare/common/store'

@Component({
  selector: 'ccr-register-clinic-inhealth-header',
  templateUrl: './inhealth.header.component.html',
  styleUrls: ['./inhealth.header.component.scss']
})
export class InHealthHeaderComponent {
  public logoUrl: string

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe((pref) => {
      this.logoUrl =
        pref.assets && pref.assets.logoUrl
          ? pref.assets.logoUrl
          : '/assets/logo.png'
    })
  }
}
