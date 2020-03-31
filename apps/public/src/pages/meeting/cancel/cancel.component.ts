import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment-timezone';
import { Schedule } from 'selvera-api';

export enum MeetingCancelStatus {
  Initial = 0,
  Error = 1,
  Succeed = 2,
  Kept = 3
}

@Component({
  selector: 'ccr-page-meeting-cancel',
  templateUrl: './cancel.component.html',
  styleUrls: ['./cancel.component.scss'],
  host: {
    class: 'ccr-page-card'
  }
})
export class MeetingCancelPageComponent implements OnInit {
  token: string;
  timestamp: moment.Moment;
  params: {
    day: string;
    time: string;
  };

  STATUS = MeetingCancelStatus;
  status: MeetingCancelStatus = MeetingCancelStatus.Initial;

  constructor(private route: ActivatedRoute, private schedule: Schedule) {}

  ngOnInit() {
    this.token = this.route.snapshot.params.token;
    this.timestamp = moment.tz(this.route.snapshot.params.timestamp, moment.tz.guess());
    this.params = {
      day: this.timestamp.format('dddd, MMMM D, YYYY'),
      time: this.timestamp.format('h:mm a (z)')
    };
  }

  keepMeeting() {
    this.status = MeetingCancelStatus.Kept;
  }

  async cancelMeeting(): Promise<void> {
    this.status = MeetingCancelStatus.Initial;
    try {
      await this.schedule.quickCancelMeeting(this.token);
      this.status = MeetingCancelStatus.Succeed;
    } catch (e) {
      this.status = MeetingCancelStatus.Error;
    }
  }
}
