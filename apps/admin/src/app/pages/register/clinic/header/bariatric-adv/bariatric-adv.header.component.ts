import { Component } from '@angular/core';
import { AppStoreFacade } from '@coachcare/common/store';

@Component({
  selector: 'ccr-register-clinic-bariatric-adv-header',
  templateUrl: './bariatric-adv.header.component.html',
  styleUrls: ['./bariatric-adv.header.component.scss']
})
export class BariatricAdvantageHeaderComponent {
  public displayName: string;
  public logoUrl: string;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      console.log({ pref });
      this.displayName = pref.displayName || '';
      this.logoUrl = pref.assets && pref.assets.logoUrl ? pref.assets.logoUrl : '/assets/logo.png';
    });
  }
}
