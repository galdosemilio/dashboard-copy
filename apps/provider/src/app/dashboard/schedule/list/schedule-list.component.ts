import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContextService, EventsService, NotifierService } from '@app/service';
import { CcrPaginator } from '@app/shared';
import * as moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { merge, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Meeting } from '../models';
import { MeetingsDatabase, MeetingsDataSource } from '../services';
import { ScheduleListTableComponent } from './table';

type QuickSelectOption = 'past' | 'upcoming' | 'all';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginator, { static: true }) paginator: CcrPaginator;
  @ViewChild(ScheduleListTableComponent, { static: true })
  listTable: ScheduleListTableComponent;

  filteredAccounts: any[] = [];
  filteredAccounts$: Subject<void> = new Subject<any>();
  form: FormGroup;
  meetingsSource: MeetingsDataSource;
  date$: Subject<void> = new Subject<void>();

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private database: MeetingsDatabase,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {
    this.quickSelectHandler = this.quickSelectHandler.bind(this);
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.bus.trigger('right-panel.component.set', 'addConsultation');

    this.createForm();
    this.createSource();

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.paginator.firstPage());
  }

  async downloadCSV() {
    try {
      this.meetingsSource.isLoading = true;
      this.meetingsSource.change$.next();
      const separator = ',';
      const criteria: any = {
        ...this.meetingsSource.args,
        limit: 'all',
        offset: 0
      };

      const response = await this.database.fetch(criteria).toPromise();

      const meetings = response.data.map((element) => new Meeting(element));
      const orgName = this.context.organization.name.replace(/\s/g, '_');
      const filename = `${orgName}_Schedule_List.csv`;
      let mostAttendees: number = 0;

      meetings.forEach(
        (meeting) =>
          (mostAttendees =
            meeting.attendees.length > mostAttendees
              ? meeting.attendees.length
              : mostAttendees)
      );

      let csv = '';
      csv += 'SCHEDULE LIST\r\n';
      csv +=
        'ID' +
        separator +
        'TITLE' +
        separator +
        'START TIME' +
        separator +
        'END TIME' +
        separator +
        'MEETING TYPE' +
        separator +
        'ORGANIZATION NAME' +
        separator;

      for (let i = 0; i < mostAttendees; ++i) {
        csv += `ID (${i + 1})${separator}`;
        csv += `FIRST NAME (${i + 1})${separator}`;
        csv += `LAST NAME (${i + 1})${separator}`;
        csv += `EMAIL (${i + 1})${separator}`;
        csv += `ATTENDANCE (${i + 1})`;

        if (i + 1 < mostAttendees) {
          csv += `${separator}`;
        }
      }

      csv += '\r\n';

      meetings.forEach((meeting) => {
        csv += `"${meeting.id}"${separator}`;
        csv += `"${meeting.title}"${separator}`;
        csv += `"${meeting.date.toISOString()}"${separator}`;
        csv += `"${meeting.endDate.toISOString()}"${separator}`;
        csv += `"${meeting.type.description}"${separator}`;
        csv += `"${meeting.organization.name}"${separator}`;

        meeting.attendees.forEach((attendee, index) => {
          csv += `"${attendee.id}"${separator}`;
          csv += `"${attendee.firstName}"${separator}`;
          csv += `"${attendee.lastName}"${separator}`;
          csv += `"${attendee.email}"${separator}`;
          csv += `"${
            attendee.attendance && attendee.attendance.status
              ? attendee.attendance.status.name
              : '-'
          }"`;

          if (index + 1 < meeting.attendees.length) {
            csv += `${separator}`;
          }
        });

        csv += '\r\n';
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
      this.notifier.error(error);
    } finally {
      this.meetingsSource.isLoading = false;
      this.meetingsSource.change$.next();
    }
  }

  onAddAccount($event: any): void {
    if ($event.id && $event.firstName) {
      this.filteredAccounts.push($event);
      this.meetingsSource.resetPaginator();
      this.filteredAccounts$.next();
    }
  }

  onRemoveAccount(index: number): void {
    this.filteredAccounts.splice(index, 1);
    this.meetingsSource.resetPaginator();
    this.filteredAccounts$.next();
  }

  toggleQuickSelect(selection: QuickSelectOption): void {
    this.form.controls.quickSelect.setValue(selection);
  }

  private createForm(): void {
    this.form = this.fb.group({
      endDate: [moment()],
      query: [],
      quickSelect: ['past'],
      startDate: [moment().startOf('year')]
    });

    merge(
      this.form.controls.startDate.valueChanges,
      this.form.controls.endDate.valueChanges
    )
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => {
        this.meetingsSource.resetPaginator();
        this.date$.next();
      });

    this.form.controls.quickSelect.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(this.quickSelectHandler);

    setTimeout(() => this.toggleQuickSelect('upcoming'));
  }

  private createSource(): void {
    this.meetingsSource = new MeetingsDataSource(this.database, this.paginator);

    this.meetingsSource.addOptional(this.filteredAccounts$, () => ({
      account:
        this.filteredAccounts && this.filteredAccounts.length
          ? this.filteredAccounts[0].id
          : undefined
    }));

    this.meetingsSource.addOptional(this.date$, () => ({
      range: {
        start: this.form.value.startDate
          ? this.form.value.startDate.toISOString()
          : undefined,
        end: this.form.value.endDate ? this.form.value.endDate.toISOString() : undefined
      }
    }));

    this.meetingsSource.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId
    }));
  }

  private quickSelectHandler(quickSelect: QuickSelectOption): void {
    let newFormValue = {};
    switch (quickSelect) {
      case 'all':
        newFormValue = {
          startDate: moment('2019-01-01', 'YYYY-MM-DD').startOf('day'),
          endDate: moment().add(3, 'months').endOf('month')
        };
        break;
      case 'past':
        newFormValue = {
          startDate: moment('2019-01-01', 'YYYY-MM-DD').startOf('day'),
          endDate: moment()
        };
        this.listTable.sort.direction = 'desc';
        this.listTable.sort.sortChange.emit();
        break;
      case 'upcoming':
        newFormValue = {
          startDate: moment(),
          endDate: moment().add(3, 'months').endOf('month')
        };
        this.listTable.sort.direction = 'asc';
        this.listTable.sort.sortChange.emit();
        break;
      default:
        break;
    }

    this.form.patchValue(newFormValue, { emitEvent: false });
    this.meetingsSource.resetPaginator();
  }
}
