import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { ClosePanel, OpenPanel } from '@app/layout/store'
import { NotifierService } from '@app/service'
import {
  ApiService,
  Entity,
  FetchTasksRequest,
  OrganizationEntity,
  TaskArtifact,
  TaskEntity,
  TaskProgress,
  TaskStatus
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'
import { ReportsState } from '../../store'
import { CcrPageSizeSelectorComponent } from '@app/shared/components/page-size-selector'
import { CcrTableSortDirective } from '@app/shared'
import { DeviceDetectorService } from 'ngx-device-detector'
import { TaskDatabase } from '../../services/task.database'
import { TaskDataSource } from '../../services/task.datasource'
import { MatDialog } from '@angular/material/dialog'
import { CreatePatientBulkReportDialog } from '../../dialogs'
import { DateTime } from 'luxon'

interface TaskNotification {
  task: Entity
}

interface TaskProgressNotification extends TaskNotification {
  progress: TaskProgress
}

interface TaskStatusNotification extends TaskNotification {
  status: {
    from: TaskStatus
    to: TaskStatus
  }
}
interface CachedArtifact extends TaskArtifact {
  expiration: DateTime
  fileNumber: number
}
@UntilDestroy()
@Component({
  selector: 'app-patient-bulk-reports',
  templateUrl: './patient-bulk-reports.component.html',
  styleUrls: ['./patient-bulk-reports.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientBulkReportsComponent
  implements AfterViewInit, OnDestroy, OnInit
{
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  @ViewChild(CcrTableSortDirective, { static: true })
  sort: CcrTableSortDirective

  @ViewChild(CcrPageSizeSelectorComponent, { static: true })
  pageSizeSelectorComp: CcrPageSizeSelectorComponent

  public criteria: Partial<FetchTasksRequest> = {}
  public isDesktop: boolean
  public isLoading: boolean
  public rows: TaskEntity[] = []
  public selectedClinic?: OrganizationEntity
  public source: TaskDataSource
  public status: number
  public statusList = []

  private refresh$: Subject<void> = new Subject<void>()
  private cachedArtifacts = new Map<string, CachedArtifact[]>()

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private database: TaskDatabase,
    private dialog: MatDialog,
    private deviceDetector: DeviceDetectorService,
    private notifier: NotifierService,
    private store: Store<ReportsState>
  ) {}

  public ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
    this.source.unsetSorter()
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges()
  }

  public ngOnInit(): void {
    this.isDesktop = this.deviceDetector.isDesktop()

    this.store.dispatch(new ClosePanel())

    this.createDataSource()
    void this.resolveTaskStatus()
    this.initWebSocket()
  }

  public onSelectClinic(clinic: OrganizationEntity): void {
    this.selectedClinic = clinic
    this.refresh$.next()
  }

  private createDataSource(): void {
    this.source = new TaskDataSource(
      this.database,
      this.notifier,
      this.paginator
    )

    this.source.addOptional(this.refresh$.pipe(debounceTime(300)), () => {
      return {
        status: this.status ? [this.status] : undefined,
        organization: this.selectedClinic ? this.selectedClinic.id : undefined
      }
    })

    this.pageSizeSelectorComp.onPageSizeChange
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((pageSize) => {
        this.paginator.pageSize = pageSize ?? this.paginator.pageSize

        if (this.paginator.pageIndex === 0) {
          this.refresh$.next()
          return
        }

        this.paginator.firstPage()
      })

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((values) => {
        this.rows = values
      })
  }

  private async resolveTaskStatus(): Promise<void> {
    this.statusList = [
      { viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined }
    ]
    try {
      const res = await this.database.fetchTaskStatusList({
        status: 'active',
        limit: 'all'
      })

      this.statusList = this.statusList.concat(
        res.data
          .sort((a, b) => Number(a.id) - Number(b.id))
          .map((status) => ({ viewValue: status.name, value: status.id }))
      )
    } catch (err) {
      this.notifier.error(err)
    }
  }

  public refresh(): void {
    this.paginator.pageIndex = 0
    this.refresh$.next()
  }

  public createDialog(): void {
    this.dialog
      .open(CreatePatientBulkReportDialog, {
        disableClose: true,
        width: '60vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(filter((created) => created))
      .subscribe(() => {
        this.refresh()
      })
  }

  public async downloadReport(
    task: TaskEntity,
    entryNumber: number
  ): Promise<void> {
    try {
      await this.loadArtifactsLocally(task.id)
      const artifactUrl = this.cachedArtifacts
        .get(task.id)
        ?.find((e) => e.fileNumber === entryNumber)?.url

      if (!artifactUrl) {
        throw new Error('Report link invalid.  File cannot be downloaded.')
      }

      window.open(artifactUrl)
    } catch (err) {
      this.notifier.error(err)
    }
  }

  // Cache artifact signed URLs locally
  private async loadArtifactsLocally(taskId: string): Promise<void> {
    try {
      const now = DateTime.now()

      // if the artifact exists AND is not expired
      if (this.cachedArtifacts.get(taskId)?.[0]?.expiration > now) {
        return
      }

      // else: fetch fresh artifacts, load signed URLs into cachedArtifacts with an expiration time and taskID
      // We aren't removing the expired artifacts for other task IDs, but that's an unnecessary step, as they would be refreshed in the case where they are explicitly attempted to be downloaded
      this.cachedArtifacts.set(
        taskId,
        (await this.database.fetchTaskArtifacts(taskId)).map(
          (artifact, index) => {
            return {
              ...artifact,
              expiration: now.plus({ minutes: 55 }),
              taskId,
              fileNumber: index
            }
          }
        )
      )
    } catch (err) {
      this.notifier.error(err)
    }
  }

  private onChangeTaskProgress(notification: TaskProgressNotification): void {
    const task = this.rows.find((entry) => entry.id === notification.task.id)

    if (!task) {
      return
    }

    task.progress = notification.progress
  }

  private onChangeTaskStatus(notification: TaskStatusNotification): void {
    const task = this.rows.find((entry) => entry.id === notification.task.id)

    if (!task) {
      return
    }

    task.status = notification.status.to

    if (notification.status.to.isCompletionState) {
      task.completedAt = new Date().toISOString()
    }
  }

  private initWebSocket(): void {
    const socket = this.api.getSocketClient()
    socket.on('notification', async (notification) => {
      switch (notification.type) {
        case 'task.status.v1':
          this.onChangeTaskStatus(JSON.parse(notification.message))
          break

        case 'task.progress.v1':
          this.onChangeTaskProgress(JSON.parse(notification.message))
          break
      }
    })
  }
}
