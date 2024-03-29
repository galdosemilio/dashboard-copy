import { CcrPaginatorComponent } from '@coachcare/common/components'
import {
  Account,
  AutoThreadParticipant,
  MessagingPreference
} from '@coachcare/sdk'
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { ParticipantDatabase, ParticipantsDataSource } from '../services'
import { MatDialog } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { _, PromptDialog, PromptDialogData } from '@app/shared'
import { CoachSelectDialog } from '@app/shared/dialogs'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'provider-auto-thread-management',
  templateUrl: './auto-thread-management.component.html',
  styleUrls: ['./auto-thread-management.component.scss']
})
export class AutoThreadManagementComponent implements OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true }) paginator
  @Input() isAdmin: boolean
  @Input() messagePreferenceId: string
  @Input() organizationId: string
  @Input() organizationName: string

  public columns: string[] = [
    'id',
    'firstName',
    'lastName',
    'createdAt',
    'actions'
  ]
  public isLoading = false
  public source: ParticipantsDataSource

  constructor(
    private database: ParticipantDatabase,
    private dialog: MatDialog,
    private messagingPreference: MessagingPreference,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.source = new ParticipantsDataSource(
      this.notifier,
      this.database,
      this.paginator
    )

    this.source.addDefault({
      id: this.messagePreferenceId
    })
  }

  public addCoach(): void {
    this.dialog
      .open(CoachSelectDialog, {
        data: {
          organizationId: this.organizationId,
          organizationName: this.organizationName
        },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((account) => account))
      .subscribe((account: Account) => {
        this.isLoading = true

        this.messagingPreference
          .addThreadAutoParticipant({
            id: this.messagePreferenceId,
            account: account.id
          })
          .then(() => {
            // this.notifier.success(_('NOTIFY.SUCCESS.COACH_CREATED'))
            this.notifier.success('Coach Added')
            this.source.refresh()
          })
          .catch((err) => this.notifier.error(err))
      })
  }

  public onRemove(coach: AutoThreadParticipant): void {
    const data: PromptDialogData = {
      title: _('GLOBAL.AUTOMATIC_THREAD_PARTICIPATION.COACH_REMOVE.TITLE'),
      content: _(
        'GLOBAL.AUTOMATIC_THREAD_PARTICIPATION.COACH_REMOVE.DESCRIPTION'
      ),
      contentParams: {
        firstName: coach.firstName,
        lastName: coach.lastName,
        organizationName: this.organizationName
      }
    }

    this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => {
        this.messagingPreference
          .deleteThreadAutoParticipant({
            id: this.messagePreferenceId,
            account: coach.id
          })
          .then(() => {
            this.notifier.success(_('NOTIFY.SUCCESS.COACH_REMOVED'))
            this.source.refresh()
          })
          .catch((err) => this.notifier.error(err))
      })
  }
}
