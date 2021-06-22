import { Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ContextService, NotifierService } from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import { Sequence } from '@coachcare/sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { filter } from 'rxjs/operators'
import { AddSequenceAutoenrollmentDialog } from '../../dialogs'
import {
  GetSequenceResponseWithExtras,
  SequenceAutoEnrollmentsDatabase,
  SequenceAutoEnrollmentsDataSource
} from '../../services'

@Component({
  selector: 'app-clinic-sequence-auto-enrollment',
  templateUrl: './clinic-sequence-auto-enrollment.component.html',
  styleUrls: ['./clinic-sequence-auto-enrollment.component.scss']
})
export class ClinicSequenceAutoEnrollmentComponent implements OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public isAdmin = false
  public rows: GetSequenceResponseWithExtras[] = []
  public source: SequenceAutoEnrollmentsDataSource

  constructor(
    private context: ContextService,
    private database: SequenceAutoEnrollmentsDatabase,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private sequence: Sequence
  ) {}

  public ngOnInit(): void {
    this.resolveAdminStatus()
    this.createSource()
  }

  public showAddAutoEnrollmentDialog(): void {
    this.dialog
      .open(AddSequenceAutoenrollmentDialog, {
        width: this.deviceDetector.isDesktop ? '40vw' : undefined
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  public showRemoveAutoEnrollmentDialog(
    sequence: GetSequenceResponseWithExtras
  ): void {
    if (!sequence.isAdmin) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.CLINIC_REMOVE_AUTOENROLLMENT'),
          content: _('BOARD.CLINIC_REMOVE_AUTOENROLLMENT_DESC'),
          contentParams: { name: sequence.name }
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.removeAutoEnrollmentSequence(sequence))
  }

  private createSource(): void {
    this.source = new SequenceAutoEnrollmentsDataSource(
      this.database,
      this.paginator
    )
    this.source.addDefault({ organization: this.context.clinic.id })
    this.source.connect().subscribe((rows) => (this.rows = rows))
  }

  private async resolveAdminStatus(): Promise<void> {
    try {
      this.isAdmin = await this.context.orgHasPerm(
        this.context.clinic.id,
        'admin'
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async removeAutoEnrollmentSequence(
    sequence: GetSequenceResponseWithExtras
  ): Promise<void> {
    try {
      await this.sequence.updateSequence({
        id: sequence.id,
        organization: sequence.organization.id,
        enrollmentOnAssociation: false
      })
      this.notifier.success(_('NOTIFY.SUCCESS.SEQUENCE_AUTOENROLLMENT_REMOVED'))
      this.paginator.firstPage()
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
