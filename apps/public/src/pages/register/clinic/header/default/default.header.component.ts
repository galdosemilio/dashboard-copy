import { Component } from '@angular/core';
import { AppStoreFacade } from '@coachcare/common/store';

@Component({
  selector: 'ccr-register-clinic-default-header',
  templateUrl: './default.header.component.html'
})
export class DefaultHeaderComponent {
  public logoUrl: string;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      this.logoUrl = pref.assets && pref.assets.logoUrl ? pref.assets.logoUrl : '/assets/logo.png';
    });
  }
}
