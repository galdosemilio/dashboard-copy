import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatMenuTrigger } from '@coachcare/material'
import {
  BILLABLE_SERVICES,
  BillableService
} from '@app/dashboard/reports/communications/models'
import { TwilioService } from '@app/layout/call/services/twilio.service'
import { UIState } from '@app/layout/store'
import { CallState } from '@app/layout/store/call'
import {
  CloseCallsBeforeInitiate,
  Source
} from '@app/layout/store/call/call.action'
import { callSelector } from '@app/layout/store/call/call.selector'
import { ContextService, LoggingService, NotifierService } from '@app/service'
import {
  ConfirmDialog,
  MessagePatientDialog,
  MessagePatientDialogProps,
  PromptDialog
} from '@app/shared/dialogs'
import { AccountTypeId, LoginHistoryItem, NamedEntity } from '@coachcare/sdk'
import { _ } from '@app/shared/utils/i18n.utils'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { unionBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AccountProvider } from '@coachcare/sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { CallControlService } from '@coachcare/common/services'
import { filter } from 'rxjs/operators'

enum AccountAvailabilityStatus {
  AVAILABLE,
  UNAVAILABLE,
  UNCERTAIN,
  EXPIRED
}

@UntilDestroy()
@Component({
  selector: 'ccr-call-control',
  templateUrl: './call-control.component.html',
  styleUrls: ['./call-control.component.scss']
})
export class CcrCallControlComponent implements OnDestroy, OnInit {
  @ViewChild(MatMenuTrigger, { static: false }) matMenuTrigger: MatMenuTrigger

  @Input()
  defaultBillableService?: BillableService
  @Input()
  disabled = false
  @Input()
  label = _('BOARD.CALL_USER')
  @Input()
  mode = 0
  @Input()
  targets
  @Input()
  showIcon = true
  @Input()
  showDisabledIcon: boolean

  public billableServices: BillableService[] = []
  public callState: CallState
  public toolTipMessage: string

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private logging: LoggingService,
    private notifier: NotifierService,
    private store: Store<UIState>,
    private translator: TranslateService,
    private twilioService: TwilioService,
    private callControlService: CallControlService
  ) {
    this.store
      .pipe(select(callSelector), untilDestroyed(this))
      .subscribe((callState) => {
        this.callState = callState

        if (this.callState.subaccountId === '' && this.callState.isSupported) {
          this.translator
            .get([_('CALL.CONFERENCE_DISABLED')])
            .subscribe((i18n) => {
              this.toolTipMessage = i18n['CALL.CONFERENCE_DISABLED']
            })
        } else {
          this.toolTipMessage = ''
        }
      })
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.callControlService.getBillableServices()
    this.callControlService.billableServices$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        const billableServices = data.map((billServ) => ({
          ...billServ,
          displayName: billServ.name
        }))

        this.billableServices = unionBy(
          Object.values(BILLABLE_SERVICES),
          billableServices,
          'id'
        )
      })
  }

  public async onClick(
    billableService: BillableService = BILLABLE_SERVICES.none
  ): Promise<void> {
    try {
      if (this.defaultBillableService || !this.billableServices.length) {
        this.matMenuTrigger.closeMenu()
      }

      const patientAvailability = await this.checkPatientAvailability()

      switch (patientAvailability.status) {
        case AccountAvailabilityStatus.AVAILABLE:
          this.dispatchCallAction(billableService)
          break
        case AccountAvailabilityStatus.UNAVAILABLE:
          this.showUnavailableDialog()
          await this.logging.log({
            logLevel: 'warn',
            data: {
              type: 'videoconferencing',
              functionType: 'call-patient',
              message: 'patient is unavailable (no login)',
              patient: this.targets[0].id,
              currentOrg: this.context.organizationId
            }
          })
          break
        case AccountAvailabilityStatus.UNCERTAIN:
          this.showUncertainDialog(billableService)
          await this.logging.log({
            logLevel: 'info',
            data: {
              type: 'videoconferencing',
              functionType: 'call-patient',
              message: 'patient is at a different organization',
              lastLogin: patientAvailability.loginItem.createdAt,
              patient: this.targets[0].id,
              currentOrg: this.context.organizationId
            }
          })
          break
        case AccountAvailabilityStatus.EXPIRED:
          this.showExpiredDialog()
          break
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async checkPatientActiveSession(id: string): Promise<boolean> {
    try {
      await this.account.checkActiveSession({ id })
      return true
    } catch (error) {
      return false
    }
  }

  private async checkPatientAvailability(): Promise<{
    loginItem?: LoginHistoryItem
    organization?: NamedEntity
    status: AccountAvailabilityStatus
  }> {
    try {
      if (
        !this.targets[0].accountType ||
        this.targets[0].accountType.id !== AccountTypeId.Client
      ) {
        return { status: AccountAvailabilityStatus.AVAILABLE }
      }

      const activeSession = await this.checkPatientActiveSession(
        this.targets[0].id
      )

      const loginHistory = await this.account.getLoginHistory({
        organization: this.context.organizationId,
        account: this.targets[0].id,
        limit: 1
      })

      if (!loginHistory.data.length) {
        return { status: AccountAvailabilityStatus.UNAVAILABLE }
      }

      const availability = {
        loginItem: loginHistory.data[0],
        organization: loginHistory.data[0].organization,
        status: undefined
      }

      if (!activeSession) {
        availability.status = AccountAvailabilityStatus.EXPIRED
      } else {
        availability.status = AccountAvailabilityStatus.AVAILABLE
      }

      return availability
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private dispatchCallAction(billableService: BillableService): void {
    this.store.dispatch(
      new CloseCallsBeforeInitiate({
        participantIsAway: false,
        billableService,
        callId: '',
        isReconnect: false,
        source: Source.OUTBOUND,
        room: {
          name: this.twilioService.createRoomName(this.context.user.id),
          organizationId: this.context.organizationId,
          initiatorId: this.context.user.id,
          participants: [
            ...this.targets.map((participant) => {
              return {
                id: participant.id,
                name: participant.firstName,
                isAvailable: false,
                isParticipating: false,
                hasFetchedStatus: false,
                callIdentity: ''
              }
            }),
            {
              id: this.context.user.id,
              name: `${
                this.context.user.firstName
              } ${this.context.user.lastName[0].toUpperCase()}.`,
              isAvailable: false,
              isParticipating: false,
              hasFetchedStatus: false,
              callIdentity: ''
            }
          ]
        }
      })
    )
  }

  private async showExpiredDialog(): Promise<void> {
    try {
      const target = this.targets[0]
      const accName = `${target.firstName}`
      const translatedMessage = await this.translator
        .get(_('CALL.PATIENT_SESSION_EXPIRED_INITIAL_MESS'), { name: accName })
        .toPromise()

      this.dialog.open(MessagePatientDialog, {
        data: {
          target,
          title: _('CALL.CALL_CANT_BE_COMPLETED'),
          content: _('CALL.PATIENT_SESSION_EXPIRED_DESC'),
          contentParams: { name: accName },
          initialMessage: translatedMessage
        } as MessagePatientDialogProps,
        width: !this.deviceDetector.isMobile() ? '60vw' : undefined
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private showUnavailableDialog(): void {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('BOARD.PATIENT_UNAVAILABLE'),
        content: _('BOARD.PATIENT_UNAVAILABLE_DESCRIPTION')
      }
    })
  }

  private showUncertainDialog(billableService: BillableService): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.PATIENT_UNCERTAIN_AVAILABILITY'),
          content: _('BOARD.PATIENT_UNCERTAIN_AVAILABILITY_DESCRIPTION'),
          yes: _('BOARD.CALL_ANYWAYS'),
          no: _('GLOBAL.CANCEL')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.dispatchCallAction(billableService))
  }
}
