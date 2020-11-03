import { Component, OnDestroy } from '@angular/core';
import {
  DisableCurrentUserCamera,
  DisableCurrentUserMicrophone,
  EnableCurrentUserCamera,
  EnableCurrentUserMicrophone,
  EnterFullscreen,
  MinimizeWindow,
  NormalizeWindow
} from '@app/layout/store/call/call.action';
import { callSelector } from '@app/layout/store/call/call.selector';
import { CallState } from '@app/layout/store/call/call.state';
import { UIState } from '@app/layout/store/state';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as CallActions from '../../../store/call';

@Component({
  selector: 'app-call-header-controls',
  templateUrl: './header-controls.component.html',
  styleUrls: ['./header-controls.component.scss']
})
export class CallHeaderControlsComponent implements OnDestroy {
  callState: CallState;

  constructor(private store: Store<UIState>) {
    this.store
      .pipe(untilDestroyed(this), select(callSelector))
      .subscribe((callState) => (this.callState = callState));
  }

  ngOnDestroy() {}

  followPointer() {
    this.store.dispatch(new CallActions.ToggleDrag(undefined));
  }

  onToggleMicrophone(isEnabled) {
    if (isEnabled) {
      this.store.dispatch(new DisableCurrentUserMicrophone());
    } else {
      this.store.dispatch(new EnableCurrentUserMicrophone());
    }
  }

  onToggleCamera(isEnabled) {
    if (isEnabled) {
      this.store.dispatch(new DisableCurrentUserCamera());
    } else {
      this.store.dispatch(new EnableCurrentUserCamera());
    }
  }

  onEnterFullscreen() {
    this.store.dispatch(new EnterFullscreen());
  }

  onNormalizeWindow() {
    this.store.dispatch(new NormalizeWindow());
  }

  onMinimizeWindow() {
    this.store.dispatch(new MinimizeWindow());
  }
}
