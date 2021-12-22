import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core'

import { EventsService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import {
  PhasesDatabase,
  PhasesDataSegment,
  PhasesDataSource
} from '../services'

@Component({
  selector: 'app-phases-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class PhasesTableComponent implements AfterViewInit {
  @Input()
  source: PhasesDataSource
  @Input()
  columns = ['id', 'title', 'organization', 'status', 'action'] // 'history'

  constructor(
    private cdr: ChangeDetectorRef,
    private database: PhasesDatabase,
    private bus: EventsService,
    private notifier: NotifierService
  ) {}

  ngAfterViewInit() {
    this.source.change$.subscribe(() => {
      this.cdr.detectChanges()
    })
  }

  async enroll(item: PhasesDataSegment) {
    try {
      await this.database.enroll(
        item,
        this.source.enrollments.find((enrollment) => enrollment.isActive)
      )

      this.bus.trigger('phases.assoc.added', item)
      this.notifier.success(_('NOTIFY.SUCCESS.PACKAGE_ENROLLED'))
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  async unenroll(item: PhasesDataSegment) {
    try {
      await this.database.unenrollPrompt(item)
      this.bus.trigger('phases.assoc.removed', item)
      this.notifier.success(_('NOTIFY.SUCCESS.PACKAGE_UNENROLLED'))
      this.source.refresh()
    } catch (error) {
      if (!error) {
        return
      }

      // non-discarded prompt
      this.notifier.error(error)
    }
  }
}
