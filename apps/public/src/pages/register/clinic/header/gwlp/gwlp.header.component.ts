import { Component } from '@angular/core';
import { AppStoreFacade } from '@coachcare/common/store';

@Component({
  selector: 'ccr-register-clinic-gwlp-header',
  templateUrl: './gwlp.header.component.html',
  styleUrls: ['./gwlp.header.component.scss']
})
export class GWLPHeaderComponent {
  public logoUrl: string;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      this.logoUrl = pref.assets && pref.assets.logoUrl ? pref.assets.logoUrl : '/assets/logo.png';
    });
  }
}
