import { Component } from '@angular/core'
import { AppStoreFacade } from '@coachcare/common/store'

@Component({
  selector: 'ccr-register-clinic-nutrimost-header',
  templateUrl: './nutrimost.header.component.html',
  styleUrls: ['./nutrimost.header.component.scss']
})
export class NutrimostHeaderComponent {
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
