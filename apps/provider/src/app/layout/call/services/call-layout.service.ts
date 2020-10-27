import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@coachcare/common/material';
import {
  COOKIE_CALL_BROWSERS_MODAL,
  COOKIE_CALL_DEVICES_MODAL,
} from '@app/config';
import { AccessRequiredDialogComponent } from '@app/layout/call/access-required-dialog/access-required-dialog.component';
import { BrowserSupportDialogComponent } from '@app/layout/call/browser-support-dialog/browser-support-dialog.component';
import { CallSettingsComponent } from '@app/layout/call/call-settings/call-settings.component';
import { CallWindowComponent } from '@app/layout/call/call-window/call-window.component';
import { CookieService } from 'ngx-cookie-service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { WindowState } from '../../store/call/call.state';
import { AccessDeniedDialogComponent } from '../access-denied-dialog/access-denied-dialog.component';

@Injectable()
export class CallLayoutService implements OnDestroy {
  private overlayCallRef: OverlayRef;
  private overlaySettingsRef: OverlayRef;

  accessRequiredDialogRef: MatDialogRef<AccessRequiredDialogComponent>;

  constructor(
    private _overlay: Overlay,
    private cookie: CookieService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy() {}

  showCall() {
    // temporary fix as suggested : https://github.com/angular/angular/issues/17572
    setTimeout(() => {
      this.overlayCallRef = this._overlay.create(
        this.createDefaultWindowOverlayConfig()
      );

      const callWindowComponent = new ComponentPortal(CallWindowComponent);
      this.overlayCallRef.attach(callWindowComponent);
    }, 0);
  }

  showSettings() {
    this.dialog.open(CallSettingsComponent, {
      width: '60vw',
      panelClass: 'ccr-full-dialog',
    });
  }

  closeSettings() {
    this.dialog.closeAll();
  }

  closeCall() {
    if (this.overlayCallRef) {
      this.overlayCallRef.detach();
      this.overlayCallRef.dispose();
    }
  }

  minimizeWindow() {
    this.overlayCallRef.detach();
    this.overlayCallRef.dispose();

    this.overlayCallRef = this._overlay.create(
      this.createMinimizedWindowOverlayConfig()
    );

    const callWindowComponent = new ComponentPortal(CallWindowComponent);
    this.overlayCallRef.attach(callWindowComponent);
  }

  enterFullscreen() {
    this.overlayCallRef.detach();
    this.overlayCallRef.dispose();

    this.overlayCallRef = this._overlay.create(
      this.createMaximizedWindowOverlayConfig()
    );

    const callWindowComponent = new ComponentPortal(CallWindowComponent);
    this.overlayCallRef.attach(callWindowComponent);
  }

  normalizeWindow() {
    this.overlayCallRef.detach();
    this.overlayCallRef.dispose();

    this.overlayCallRef = this._overlay.create(
      this.createDefaultWindowOverlayConfig()
    );

    const callWindowComponent = new ComponentPortal(CallWindowComponent);
    this.overlayCallRef.attach(callWindowComponent);
  }

  private createDefaultWindowOverlayConfig(
    bottom: string = '2em',
    left: string = '2em',
    top?: string,
    right?: string
  ) {
    const positionStrategy = this._overlay.position().global();

    if (bottom) {
      positionStrategy.bottom(bottom);
    }

    if (left) {
      positionStrategy.left(left);
    }

    if (top) {
      positionStrategy.top(top);
    }

    if (right) {
      positionStrategy.right(right);
    }

    return new OverlayConfig({
      hasBackdrop: false,
      positionStrategy: positionStrategy,
      panelClass: ['ccr-overlay-panel', 'ccr-call-window'],
    });
  }

  private createMaximizedWindowOverlayConfig() {
    const positionStrategy = this._overlay.position().global();
    positionStrategy.top('0');
    positionStrategy.left('0');

    return new OverlayConfig({
      hasBackdrop: false,
      width: '100vw',
      height: '100vw',
      positionStrategy: positionStrategy,
      panelClass: 'ccr-overlay-panel',
    });
  }

  private createMinimizedWindowOverlayConfig() {
    const positionStrategy = this._overlay.position().global();
    positionStrategy.bottom('0');
    positionStrategy.left('0');

    return new OverlayConfig({
      hasBackdrop: false,
      positionStrategy: positionStrategy,
      panelClass: 'ccr-overlay-panel',
    });
  }

  private createSettingsBackdropOverlayConfig() {
    const positionStrategy = this._overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    return new OverlayConfig({
      hasBackdrop: true,
      height: '400px',
      width: '600px',
      positionStrategy: positionStrategy,
      panelClass: 'ccr-overlay-panel',
    });
  }

  openAccessRequiredDialog() {
    this.accessRequiredDialogRef = this.dialog.open(
      AccessRequiredDialogComponent,
      {
        disableClose: true,
      }
    );

    this.accessRequiredDialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((deviceAvailability = {}) => {
        if (!deviceAvailability.audio) {
          this.dialog.open(AccessDeniedDialogComponent, {
            disableClose: true,
            panelClass: 'ccr-full-dialog',
          });
        }
        this.cookie.set(COOKIE_CALL_DEVICES_MODAL, 'true', 365, '/');
      });
  }

  openBrowserUnsupported() {
    this.dialog
      .open(BrowserSupportDialogComponent)
      .afterClosed()
      .subscribe(() => {
        this.cookie.set(COOKIE_CALL_BROWSERS_MODAL, 'true', 365, '/');
      });
  }
}
