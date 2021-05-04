import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog, MatSelectChange } from '@coachcare/material'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import {
  AddManualInteractionDialog,
  ConfirmDialog,
  PromptDialog,
  TextInputDialog
} from '@app/shared'
import { _ } from '@app/shared/utils'
import { TranslateService } from '@ngx-translate/core'
import { get, unionBy } from 'lodash'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { first } from 'rxjs/operators'
import { Interaction } from '@coachcare/sdk'
import { BILLABLE_SERVICES, BillableService, CallHistoryItem } from '../models'
import { CallHistoryDatabase, CallHistoryDataSource } from '../services'

@UntilDestroy()
@Component({
  selector: 'app-reports-calls',
  templateUrl: './calls.component.html',
  styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnDestroy, OnInit {
  @Input() set account(value: string) {
    this._account = value
    this.account$.next(value)
  }

  get account(): string {
    return this._account
  }

  @Input() allowCreation = false

  @ViewChild(CcrPaginatorComponent, { static: true }) paginator

  billableServices: BillableService[] = []
  clinic: SelectedOrganization
  columns: string[] = [
    'type',
    'rpmBillable',
    'participants',
    'clinic',
    'start',
    'note',
    'actions'
  ]
  isLoading = false
  shownColumns: string[] = this.columns.slice()
  source: CallHistoryDataSource

  private _account: string
  private account$: Subject<string> = new Subject<string>()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: CallHistoryDatabase,
    private dialog: MatDialog,
    private interaction: Interaction,
    private notify: NotifierService,
    private translate: TranslateService
  ) {}

  ngOnDestroy() {}

  async ngOnInit() {
    try {
      this.source = new CallHistoryDataSource(this.database, this.paginator)
      this.source.addDefault({
        status: 'ended'
      })
      this.source.addRequired(this.context.organization$, () => ({
        organization: this.context.organizationId
      }))
      this.source.addOptional(this.account$, () => ({ account: this.account }))
    } catch (error) {
      this.notify.error(error)
    }

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.clinic = org
      this.refreshShownColumns()
      this.resolveBillableServices()
    })
  }

  async downloadCSV() {
    try {
      const translations = await this.translate.getTranslation('en').toPromise()

      this.isLoading = true

      const source = new CallHistoryDataSource(this.database)
      source.addDefault({
        organization: this.context.organizationId,
        account: this.account || undefined,
        limit: 'all',
        offset: 0
      })

      const calls = await source.connect().pipe(first()).toPromise()

      const separator = ','
      const orgName = this.context.organization.name.replace(/\s/g, '_')
      const filename = `${orgName}_COMMS_REPORT.csv`
      let highestParticipantAmount = 0

      calls.forEach(
        (call) =>
          (highestParticipantAmount =
            highestParticipantAmount > call.participants.length
              ? highestParticipantAmount
              : call.participants.length)
      )

      let csv = ''
      csv += 'CALL HISTORY\r\n'

      csv += `"INITIATOR"${separator}`
      csv += `"ORGANIZATION"${separator}`
      csv += `"TIMESTAMP"${separator}`
      csv += `"TYPE"${separator}`
      csv += `"DURATION"${separator}`
      csv += `"ADDENDUM TEXT"${separator}`
      csv += `"ADDENDUM CHANGE"${separator}`
      csv += `"ADDENDUM CREATOR"${separator}`

      for (let i = 0; i < highestParticipantAmount; ++i) {
        csv += `"PARTICIPANT [${i + 1}]"`
        if (i < highestParticipantAmount - 1) {
          csv += `${separator}`
        }
      }

      csv += '\r\n'

      calls.forEach((call) => {
        csv += `"${call.initiator.firstName} ${call.initiator.lastName}, ${call.initiator.email}, ID: ${call.initiator.id}"${separator}`
        csv += `"${call.organization.name} (ID: ${call.organization.id})"${separator}`

        csv += `"${moment(call.time.start).toISOString()}"${separator}`
        csv += `"${get(
          translations,
          call.type.displayName,
          call.type.name
        )}"${separator}`
        csv += `"${call.time.duration} minutes"${separator}`
        csv += `"${
          call.latestAuditLog.note ? call.latestAuditLog.note : '-'
        }"${separator}`
        if (Object.keys(call.latestAuditLog).length) {
          csv += `"Changed from ${call.latestAuditLog.billableService.previous.name} to ${call.latestAuditLog.billableService.current.name}"${separator}`
        } else {
          csv += `"-"${separator}`
        }
        csv += `"${
          call.latestAuditLog.createdBy
            ? call.latestAuditLog.createdBy.firstName +
              ' ' +
              call.latestAuditLog.createdBy.lastName +
              ' (ID: ' +
              call.latestAuditLog.createdBy.id +
              ')'
            : '-'
        }"${separator}`

        call.participants.forEach((participant, index) => {
          csv += `"`
          csv += `${participant.firstName} ${participant.lastName} (ID: ${participant.id})"`
          if (index < call.participants.length - 1) {
            csv += `${separator}`
          }
        })
        csv += `\r\n`
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  public async onRpmBillableChange(
    row: CallHistoryItem,
    $event: MatSelectChange
  ): Promise<void> {
    try {
      const billServ = this.billableServices.find(
        (element) => element.id === $event.value
      )

      if (!billServ) {
        return
      }

      const noteIsRequired =
        moment().diff(moment(row.time.start), 'hours') >= 24
      const previousBillableService = row.billableService
      let note: string | boolean

      if (noteIsRequired) {
        note = await this.dialog
          .open(TextInputDialog, {
            data: {
              description: _('REPORTS.CALLS_LATE_EDIT_DESCRIPTION'),
              title: _('LIBRARY.FORMS.ADDENDUM'),
              ok: _('GLOBAL.UPDATE')
            },
            width: '60vw'
          })
          .afterClosed()
          .toPromise()
      }

      if (noteIsRequired && !note) {
        $event.source.value = row.billableService.id
        this.cdr.detectChanges()
        return
      }

      await this.interaction.update({
        id: row.id,
        billableService: billServ.id === '-1' ? null : billServ.id,
        note: note as string
      })

      row.billableService = billServ

      if (!noteIsRequired) {
        this.notify.success(_('NOTIFY.SUCCESS.INTERACTION_UPDATED'))
        return
      }

      row.note = note as string
      row.latestAuditLog = {
        billableService: {
          previous: previousBillableService,
          current: billServ
        },
        createdBy: {
          firstName: this.context.user.firstName,
          lastName: this.context.user.lastName,
          id: this.context.user.id
        },
        note: note as string
      }
      row.canUpdateRpmBilling = false
      row.canBeDeleted = false
      this.notify.success(_('NOTIFY.SUCCESS.INTERACTION_UPDATED'))
    } catch (error) {
      this.notify.error(error)
    }
  }

  public async showAddendumDialog(row: CallHistoryItem): Promise<void> {
    const billableServices = Object.values(BILLABLE_SERVICES)
    const previousService = billableServices.find(
      (billServ) =>
        billServ.id === row.latestAuditLog.billableService.previous.id
    )
    const currentService = billableServices.find(
      (billServ) =>
        billServ.id === row.latestAuditLog.billableService.current.id
    )

    const translatedLine = await this.translate
      .get(_('REPORTS.CALL_ADDENDUM_CHANGE'), {
        previous: previousService
          ? previousService.name
          : row.latestAuditLog.billableService.previous.name,
        current: currentService
          ? currentService.name
          : row.latestAuditLog.billableService.current.name
      })
      .toPromise()

    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('LIBRARY.FORMS.ADDENDUM'),
        content: `<strong>${
          row.latestAuditLog.createdBy.firstName +
          ' ' +
          row.latestAuditLog.createdBy.lastName
        }</strong><br/><br/>
        ${translatedLine}
        <br/><br/><i>${row.latestAuditLog.note}</i>`,
        hideAcceptButton: true
      },
      width: '60vw'
    })
  }

  showAddInteractionDialog(): void {
    this.dialog
      .open(AddManualInteractionDialog, { width: '60vw' })
      .afterClosed()
      .subscribe((refresh) => {
        if (!refresh) {
          return
        }

        this.source.refresh()
      })
  }

  showRemoveInteractionDialog(interaction: CallHistoryItem): void {
    if (!interaction.canBeDeleted) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('REPORTS.REMOVE_INTERACTION_TITLE'),
          content: _('REPORTS.REMOVE_INTERACTION_DESCRIPTION')
        }
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (!confirm) {
          return
        }

        this.removeInteraction(interaction)
      })
  }

  private refreshShownColumns(): void {
    this.shownColumns = this.columns.slice()

    const rpmEnabled = get(this.clinic, 'preferences.rpm.isActive', false)

    if (!rpmEnabled) {
      this.shownColumns = this.shownColumns.filter(
        (col) => col !== 'rpmBillable'
      )
    }

    if (!this.allowCreation) {
      this.shownColumns = this.shownColumns.filter((col) => col !== 'actions')
    }
  }

  private async removeInteraction(interaction: CallHistoryItem): Promise<void> {
    try {
      await this.interaction.delete({ id: interaction.id })
      this.notify.success(_('NOTIFY.SUCCESS.INTERACTION_REMOVED'))
      this.source.refresh()
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async resolveBillableServices(): Promise<void> {
    try {
      const billableServices = (
        await this.interaction.getBillableServices({
          limit: 'all',
          status: 'active'
        })
      ).data.map((billServ) => ({ ...billServ, displayName: billServ.name }))

      this.billableServices = unionBy(
        Object.values(BILLABLE_SERVICES),
        billableServices,
        'id'
      )
    } catch (error) {
      this.notify.error(error)
    }
  }
}
