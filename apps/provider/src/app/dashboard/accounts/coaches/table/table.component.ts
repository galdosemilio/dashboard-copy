import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { MatDialog, MatSort, Sort } from '@coachcare/material'
import { Router } from '@angular/router'
import {
  AccountAccessData,
  AccountTypeId,
  Affiliation,
  OrganizationProvider
} from '@coachcare/sdk'

import { ContextService, NotifierService } from '@app/service'
import {
  _,
  AccountRedirectDialog,
  PromptDialog,
  PromptDialogData
} from '@app/shared'
import { CoachesDataSource } from '../services'

@Component({
  selector: 'app-coaches-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class CoachesTableComponent implements OnInit {
  @Input()
  columns = ['id', 'firstName', 'lastName', 'email', 'date', 'actions']
  @Input()
  source: CoachesDataSource | null
  @Input()
  showActions: boolean

  @Output()
  onSorted = new EventEmitter<Sort>()

  @ViewChild(MatSort, { static: false })
  sort: MatSort

  public authenticatedUserId: string

  constructor(
    private cdr: ChangeDetectorRef,
    private affiliation: Affiliation,
    private dialog: MatDialog,
    private router: Router,
    private context: ContextService,
    private notifier: NotifierService,
    private organization: OrganizationProvider
  ) {}

  ngOnInit() {
    this.cdr.detectChanges()
    this.authenticatedUserId = this.context.user.id
  }

  onSort(sort: Sort) {
    this.onSorted.emit(sort)
  }

  async onRemove(coach) {
    try {
      const response = await this.organization.getAccessibleList({
        account: coach.id,
        status: 'active',
        strict: true,
        limit: 2
      })

      const hasDiffClinic = response.data.find(
        (access) => access.organization.id !== this.context.organizationId
      )

      if (hasDiffClinic) {
        this.dialog.open(AccountRedirectDialog, {
          data: {
            account: coach,
            accountType: AccountTypeId.Provider
          },
          width: '60vw'
        })
      } else {
        const data: PromptDialogData = {
          title: _('BOARD.COACH_REMOVE'),
          content: _('BOARD.COACH_REMOVE_PROMPT'),
          contentParams: { coach: `${coach.firstName} ${coach.lastName}` }
        }
        this.dialog
          .open(PromptDialog, { data: data })
          .afterClosed()
          .subscribe((confirm) => {
            if (confirm) {
              this.affiliation
                .disassociate({
                  account: coach.id,
                  organization: this.source.args.organization
                })
                .then(() => {
                  this.notifier.success(_('NOTIFY.SUCCESS.COACH_REMOVED'))
                  // trigger a table refresh
                  this.source.refresh()
                })
                .catch((err) => this.notifier.error(err))
            }
          })
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  showCoach(coach: AccountAccessData, newTab?: boolean): void {
    if (this.showActions) {
      this.context.account = coach
      if (newTab) {
        window.open(
          `${window.location.href.split('?')[0]}/${coach.id}`,
          '_blank'
        )
      } else {
        this.router.navigate(['/accounts/coaches', coach.id])
      }
    }
  }
}
