import { Component } from '@angular/core';
import { AppStoreFacade } from '@coachcare/common/store';

@Component({
  selector: 'ccr-register-clinic-apollo-header',
  templateUrl: './apollo.header.component.html',
  styleUrls: ['./apollo.header.component.scss']
})
export class ApolloHeaderComponent {
  public logoUrl: string;

  constructor(private org: AppStoreFacade) {
    this.org.pref$.subscribe(pref => {
      this.logoUrl = pref.assets && pref.assets.logoUrl ? pref.assets.logoUrl : '/assets/logo.png';
    });
  }
}
