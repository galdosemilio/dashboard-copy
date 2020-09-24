import { Component } from '@angular/core';
import { AppStoreFacade } from '@coachcare/common/store';

@Component({
  selector: 'ccr-register-clinic-shake-it-header',
  templateUrl: './shake-it.header.component.html',
  styleUrls: ['./shake-it.header.component.scss']
})
export class ShakeItHeaderComponent {
  public logoUrl: string;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      this.logoUrl = pref.assets && pref.assets.logoUrl ? pref.assets.logoUrl : '/assets/logo.png';
    });
  }
}
