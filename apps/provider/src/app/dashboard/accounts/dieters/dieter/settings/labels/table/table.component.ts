import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core'

import {
  LabelsDatabase,
  LabelsDataSegment,
  LabelsDataSource
} from '@app/dashboard/accounts/dieters/dieter/settings/services'
import {
  EVENT_PHASE_ASSOC_ADDED,
  EVENT_PHASE_ASSOC_REMOVED,
  EventsService,
  NotifierService
} from '@app/service'
import { _ } from '@app/shared'

@Component({
  selector: 'app-labels-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class LabelsTableComponent implements AfterViewInit {
  @Input()
  source: LabelsDataSource
  @Input()
  columns = ['id', 'title', 'organization', 'status', 'action'] // 'history'

  constructor(
    private cdr: ChangeDetectorRef,
    private database: LabelsDatabase,
    private bus: EventsService,
    private notifier: NotifierService
  ) {}

  ngAfterViewInit() {
    this.source.change$.subscribe(() => {
      this.cdr.detectChanges()
    })
  }

  enroll(item: LabelsDataSegment) {
    this.database
      .enroll(
        item,
        this.source.enrollments.find((enrollment) => enrollment.isActive)
      )
      .then(() => {
        this.bus.trigger(EVENT_PHASE_ASSOC_ADDED, item)
        this.notifier.success(_('NOTIFY.SUCCESS.PACKAGE_ENROLLED'))
        this.source.refresh()
      })
      .catch((err) => {
        this.notifier.error(err)
      })
  }

  unenroll(item: LabelsDataSegment) {
    this.database
      .unenrollPrompt(item)
      .then(() => {
        this.bus.trigger(EVENT_PHASE_ASSOC_REMOVED, item)
        this.notifier.success(_('NOTIFY.SUCCESS.PACKAGE_UNENROLLED'))
        this.source.refresh()
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }
}
