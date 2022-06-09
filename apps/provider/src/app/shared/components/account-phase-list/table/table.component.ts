import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { EventsService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { MatSort } from '@coachcare/material'
import { GetAllPackageOrganizationRequest } from '@coachcare/sdk'
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
export class PhasesTableComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input()
  source: PhasesDataSource
  @Input()
  columns = ['id', 'title', 'organization', 'status', 'action'] // 'history'

  @ViewChild(MatSort, { static: true })
  sort: MatSort

  constructor(
    private cdr: ChangeDetectorRef,
    private database: PhasesDatabase,
    private bus: EventsService,
    private notifier: NotifierService
  ) {}

  public ngAfterViewInit() {
    this.source.change$.subscribe(() => {
      this.cdr.detectChanges()
    })
  }

  public ngOnDestroy(): void {
    this.source.unsetSorter()
  }

  public ngOnInit(): void {
    this.source.setSorter(this.sort, () => ({
      sort: this.sort.active
        ? ([
            {
              property: this.sort.active,
              dir: this.sort.direction || 'asc'
            }
          ] as GetAllPackageOrganizationRequest['sort'])
        : []
    }))
  }

  public async enroll(item: PhasesDataSegment) {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      await this.database.enroll(item)
      this.bus.trigger('phases.assoc.added', item)
      this.notifier.success(_('NOTIFY.SUCCESS.PACKAGE_ENROLLED'))
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)

      /**
       * We only hide the loading indicator here
       * because on success the refresh logic takes care
       * of it.
       */
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  public async unenroll(item: PhasesDataSegment) {
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
