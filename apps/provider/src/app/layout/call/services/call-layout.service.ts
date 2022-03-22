import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Injectable, OnDestroy } from '@angular/core'
import { MatDialog, MatDialogRef } from '@coachcare/material'
import {
  COOKIE_CALL_BROWSERS_MODAL,
  COOKIE_CALL_DEVICES_MODAL,
  STORAGE_VIDEOCONFERENCE_SETTINGS
} from '@app/config'
import { BILLABLE_SERVICES } from '@app/dashboard/reports/communications/models'
import { AccessRequiredDialogComponent } from '@app/layout/call/access-required-dialog/access-required-dialog.component'
import { BrowserSupportDialogComponent } from '@app/layout/call/browser-support-dialog/browser-support-dialog.component'
import { CcrCallSettingsComponent } from '@app/layout/call/call-settings'
import { CallWindowComponent } from '@app/layout/call/call-window/call-window.component'
import { UIState } from '@app/layout/store'
import {
  AcceptCall,
  CloseCallsBeforeInitiate,
  ReceiveCall,
  Source,
  StoreCallSettings
} from '@app/layout/store/call'
import { ContextService, NotifierService } from '@app/service'
import { CallRatingDialog } from '@app/shared'
import { Store } from '@ngrx/store'
import { CookieService } from 'ngx-cookie-service'
import { DeviceDetectorService } from 'ngx-device-detector'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Interaction } from '@coachcare/sdk'
import { AccessDeniedDialogComponent } from '../access-denied-dialog/access-denied-dialog.component'

@UntilDestroy()
@Injectable()
export class CallLayoutService implements OnDestroy {
  private callRatingModalOpen: boolean
  private overlayCallRef: OverlayRef
  private overlaySettingsRef: OverlayRef

  accessRequiredDialogRef: MatDialogRef<AccessRequiredDialogComponent>

  constructor(
    private _overlay: Overlay,
    private context: ContextService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private store: Store<UIState>,
    private deviceDetector: DeviceDetectorService,
    private interaction: Interaction
  ) {}

  ngOnDestroy() {}

  showCall() {
    // temporary fix as suggested : https://github.com/angular/angular/issues/17572
    setTimeout(() => {
      this.overlayCallRef = this._overlay.create(
        this.createDefaultWindowOverlayConfig()
      )

      const callWindowComponent = new ComponentPortal(CallWindowComponent)
      this.overlayCallRef.attach(callWindowComponent)
    }, 0)
  }

  public showCallRatingModal(): void {
    if (this.callRatingModalOpen) {
      return
    }

    this.callRatingModalOpen = true

    let modal
    if (this.deviceDetector.isDesktop) {
      modal = this.dialog.open(CallRatingDialog, {
        width: '30vw',
        disableClose: true
      })
    } else if (this.deviceDetector.isTablet) {
      modal = this.dialog.open(CallRatingDialog, {
        width: '60vw',
        disableClose: true
      })
    } else {
      modal = this.dialog.open(CallRatingDialog, {
        width: '100vw',
        panelClass: 'ccr-full-dialog',
        disableClose: true
      })
    }

    modal.afterClosed().subscribe(() => (this.callRatingModalOpen = false))
  }

  showSettings() {
    this.dialog.open(CcrCallSettingsComponent, {
      width: '60vw',
      panelClass: 'ccr-full-dialog'
    })
  }

  async recoverCall() {
    try {
      const calls = await this.interaction.getAllSelf({
        status: 'in-progress',
        limit: 1
      })

      if (!calls.data.length) {
        window.localStorage.removeItem(STORAGE_VIDEOCONFERENCE_SETTINGS)
        return
      }

      const videoConferenceData = JSON.parse(
        window.localStorage.getItem(STORAGE_VIDEOCONFERENCE_SETTINGS)
      )

      let billableService

      const recentCall = calls.data[0]
      const isInitiator = recentCall.initiator.id === this.context.user.id

      if (recentCall.billableService) {
        const foundBillServ = Object.values(BILLABLE_SERVICES).find(
          (billServ) => billServ.id === recentCall.billableService.id
        )
        billableService = foundBillServ ? foundBillServ : BILLABLE_SERVICES.none
      } else {
        billableService = BILLABLE_SERVICES.none
      }

      if (
        videoConferenceData &&
        !videoConferenceData.participantJoined &&
        isInitiator
      ) {
        this.store.dispatch(
          new CloseCallsBeforeInitiate({
            participantIsAway: false,
            billableService: billableService,
            callId: '',
            isReconnect: false,
            source: Source.OUTBOUND,
            room: {
              name: recentCall.room,
              organizationId: recentCall.organization.id,
              initiatorId: recentCall.initiator.id,
              participants: recentCall.participants.requested.map(
                (recentCallParticipant) => ({
                  id: recentCallParticipant.id,
                  name: `${
                    recentCallParticipant.firstName
                  } ${recentCallParticipant.lastName[0].toUpperCase()}.`,
                  isParticipating: false,
                  isAvailable: false,
                  hasFetchedStatus: false,
                  callIdentity: ''
                })
              )
            }
          })
        )
      } else {
        this.store.dispatch(
          new ReceiveCall({
            participantIsAway: false,
            billableService: billableService,
            callId: recentCall.id,
            isReconnect: true,
            source: isInitiator ? Source.OUTBOUND : Source.INBOUND,
            room: {
              name: recentCall.room,
              organizationId: recentCall.organization.id,
              initiatorId: recentCall.initiator.id,
              participants: recentCall.participants.attended.map(
                (recentCallParticipant) => ({
                  id: recentCallParticipant.id,
                  name: `${
                    recentCallParticipant.firstName
                  } ${recentCallParticipant.lastName[0].toUpperCase()}.`,
                  isParticipating: true,
                  isAvailable: false,
                  hasFetchedStatus: false,
                  callIdentity: ''
                })
              )
            }
          })
        )

        this.store.dispatch(
          new AcceptCall({ enableVideo: videoConferenceData.video })
        )
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  closeSettings() {
    this.dialog.closeAll()
  }

  closeCall() {
    if (this.overlayCallRef) {
      this.overlayCallRef.detach()
      this.overlayCallRef.dispose()
    }
  }

  minimizeWindow() {
    this.overlayCallRef.detach()
    this.overlayCallRef.dispose()

    this.overlayCallRef = this._overlay.create(
      this.createMinimizedWindowOverlayConfig()
    )

    const callWindowComponent = new ComponentPortal(CallWindowComponent)
    this.overlayCallRef.attach(callWindowComponent)
  }

  enterFullscreen() {
    this.overlayCallRef.detach()
    this.overlayCallRef.dispose()

    this.overlayCallRef = this._overlay.create(
      this.createMaximizedWindowOverlayConfig()
    )

    const callWindowComponent = new ComponentPortal(CallWindowComponent)
    this.overlayCallRef.attach(callWindowComponent)
  }

  normalizeWindow() {
    this.overlayCallRef.detach()
    this.overlayCallRef.dispose()

    this.overlayCallRef = this._overlay.create(
      this.createDefaultWindowOverlayConfig()
    )

    const callWindowComponent = new ComponentPortal(CallWindowComponent)
    this.overlayCallRef.attach(callWindowComponent)
  }

  public storeCallSettings() {
    this.store.dispatch(new StoreCallSettings())
  }

  private createDefaultWindowOverlayConfig(
    bottom: string = '2em',
    left: string = '2em',
    top?: string,
    right?: string
  ) {
    const positionStrategy = this._overlay.position().global()

    if (bottom) {
      positionStrategy.bottom(bottom)
    }

    if (left) {
      positionStrategy.left(left)
    }

    if (top) {
      positionStrategy.top(top)
    }

    if (right) {
      positionStrategy.right(right)
    }

    return new OverlayConfig({
      hasBackdrop: false,
      positionStrategy: positionStrategy,
      panelClass: ['ccr-overlay-panel', 'ccr-call-window']
    })
  }

  private createMaximizedWindowOverlayConfig() {
    const positionStrategy = this._overlay.position().global()
    positionStrategy.top('0')
    positionStrategy.left('0')

    return new OverlayConfig({
      hasBackdrop: false,
      width: '100vw',
      height: '100vw',
      positionStrategy: positionStrategy,
      panelClass: 'ccr-overlay-panel'
    })
  }

  private createMinimizedWindowOverlayConfig() {
    const positionStrategy = this._overlay.position().global()
    positionStrategy.bottom('0')
    positionStrategy.left('0')

    return new OverlayConfig({
      hasBackdrop: false,
      positionStrategy: positionStrategy,
      panelClass: 'ccr-overlay-panel'
    })
  }

  private createSettingsBackdropOverlayConfig() {
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically()
    return new OverlayConfig({
      hasBackdrop: true,
      height: '400px',
      width: '600px',
      positionStrategy: positionStrategy,
      panelClass: 'ccr-overlay-panel'
    })
  }

  openAccessRequiredDialog() {
    this.accessRequiredDialogRef = this.dialog.open(
      AccessRequiredDialogComponent,
      {
        disableClose: true
      }
    )

    this.accessRequiredDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((deviceAvailability = {}) => {
        if (!deviceAvailability.audio) {
          this.dialog.open(AccessDeniedDialogComponent, {
            disableClose: true,
            panelClass: 'ccr-full-dialog'
          })
        }
        this.cookie.set(COOKIE_CALL_DEVICES_MODAL, 'true', 365, '/')
      })
  }

  openBrowserUnsupported() {
    this.dialog
      .open(BrowserSupportDialogComponent)
      .afterClosed()
      .subscribe(() => {
        this.cookie.set(COOKIE_CALL_BROWSERS_MODAL, 'true', 365, '/')
      })
  }
}
