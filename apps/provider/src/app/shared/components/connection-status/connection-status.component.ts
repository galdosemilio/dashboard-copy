import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Conference } from 'selvera-api';

@Component({
  selector: 'ccr-connection-status',
  templateUrl: './connection-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcrConnectionStatusComponent {
  @Input()
  userId: string;
  @Input()
  organizationId: string;

  availability: boolean;

  constructor(private conference: Conference) {}

  ngOnInit() {
    // debugger;
    // const request: FetchUserAvailabilityRequest = {
    //   account: this.userId,
    //   organization: this.organizationId
    // };
    // this.conference.fetchUserAvailability(request).then(result => {
    //   console.log(request);
    // });
  }
}
