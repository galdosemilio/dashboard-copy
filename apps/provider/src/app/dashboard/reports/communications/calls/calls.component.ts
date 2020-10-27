import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ContextService, NotifierService, SelectedOrganization } from '@app/service';
import { CcrPaginator } from '@app/shared';
import * as moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { Conference } from 'selvera-api';
import { CallHistoryItem } from '../models';
import { CallHistoryDatabase, CallHistoryDataSource } from '../services';

@Component({
  selector: 'app-reports-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
  @Input() set account(value: string) {
    this._account = value;
    this.account$.next(value);
  }

  get account(): string {
    return this._account;
  }

  @ViewChild(CcrPaginator, { static: true }) paginator;

  columns: string[] = ['participants', 'clinic', 'start', 'duration'];
  isLoading: boolean = false;
  source: CallHistoryDataSource;
  clinic: SelectedOrganization;

  private _account: string;
  private account$: Subject<string> = new Subject<string>();

  constructor(
    private conference: Conference,
    private context: ContextService,
    private database: CallHistoryDatabase,
    private notify: NotifierService
  ) {}

  ngOnDestroy() {}

  async ngOnInit() {
    try {
      this.source = new CallHistoryDataSource(this.database, this.paginator);
      this.source.addDefault({
        status: 'ended'
      });
      this.source.addRequired(this.context.organization$, () => ({
        organization: this.context.organizationId
      }));
      this.source.addOptional(this.account$, () => ({ account: this.account }));
    } catch (error) {
      this.notify.error(error);
    }

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org;
    });
  }

  async downloadCSV() {
    try {
      this.isLoading = true;
      const calls = (
        await this.conference.fetchCalls({
          organization: this.context.organizationId,
          account: this.account || undefined,
          limit: 'all',
          offset: 0
        })
      ).data.map((item) => new CallHistoryItem(item));

      const separator = ',';
      const orgName = this.context.organization.name.replace(/\s/g, '_');
      const filename = `${orgName}_CALL_REPORT.csv`;
      let highestParticipantAmount = 0;

      calls.forEach(
        (call) =>
          (highestParticipantAmount =
            highestParticipantAmount > call.participants.length
              ? highestParticipantAmount
              : call.participants.length)
      );

      let csv = '';
      csv += 'CALL HISTORY\r\n';

      csv += `"INITIATOR"${separator}`;
      csv += `"ORGANIZATION"${separator}`;
      csv += `"TIMESTAMP"${separator}`;
      csv += `"DURATION"${separator}`;

      for (let i = 0; i < highestParticipantAmount; ++i) {
        csv += `"PARTICIPANT [${i + 1}]"`;
        if (i < highestParticipantAmount - 1) {
          csv += `${separator}`;
        }
      }

      csv += '\r\n';

      calls.forEach((call) => {
        csv += `"${call.initiator.firstName} ${call.initiator.lastName}, ${call.initiator.email}, ID: ${call.initiator.id}"${separator}`;
        csv += `"${call.organization.name} (ID: ${call.organization.id})"${separator}`;

        csv += `"${moment(call.time.start).toISOString()}"${separator}`;
        csv += `"${call.time.duration} minutes"${separator}`;

        csv += `"`;
        call.participants.forEach((participant, index) => {
          csv += `${participant.firstName} ${participant.lastName} (ID: ${participant.id})`;
          if (index < call.participants.length - 1) {
            csv += `"${separator}`;
          }
        });
        csv += `\r\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('visibility', 'hidden');
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      this.notify.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
