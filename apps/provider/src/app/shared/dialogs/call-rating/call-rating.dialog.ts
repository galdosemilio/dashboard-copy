import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@coachcare/common/material';
import { callSelector, CallState } from '@app/layout/store/call';
import { ContextService, LoggingService, NotifierService } from '@app/service';
import { _, FormUtils, sleep } from '@app/shared/utils';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { Account } from 'selvera-api';

type CallRatingOption = 'ok' | 'bad';

@Component({
  selector: 'ccr-call-rating',
  templateUrl: './call-rating.dialog.html',
  styleUrls: ['./call-rating.dialog.scss'],
  host: { class: 'ccr-dialog' },
})
export class CallRatingDialog implements OnDestroy, OnInit {
  public currentUser: any;
  public form: FormGroup;
  public hoveredOption: string;
  public isLoading: boolean;
  public selectedOption: string;
  public preventClosing: boolean;
  public remotePeerLogData?: any;

  private userLogData: any = {};

  constructor(
    private account: Account,
    private context: ContextService,
    private dialogRef: MatDialogRef<CallRatingDialog>,
    private fb: FormBuilder,
    private formUtils: FormUtils,
    private notifier: NotifierService,
    private logging: LoggingService,
    private store: Store<CallState>
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.refreshCurrentUser();
    this.createForm();
    this.startWindowTimeout();

    this.store
      .pipe(select(callSelector), take(1), untilDestroyed(this))
      .subscribe(async (callState) => {
        try {
          const remotePeer = callState.room.participants.find(
            (participant) => participant.id !== this.context.user.id
          );

          if (!remotePeer) {
            throw new Error('no remote peer');
          }

          const remotePeerData = await this.account.getSingle(remotePeer.id);

          this.remotePeerLogData = {
            targetUserId: remotePeer.id,
            targetUserEmail: remotePeerData.email,
          };
        } catch (error) {
          this.remotePeerLogData = {};
        }
      });

    this.dialogRef
      .backdropClick()
      .pipe(untilDestroyed(this))
      .subscribe(() => this.close('backdrop'));
  }

  public async close(reason?: string): Promise<void> {
    if (!reason) {
      this.dialogRef.close();
      return;
    }

    switch (reason) {
      case 'timeout':
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'closed modal due to timeout',
            ...this.userLogData,
            ...this.remotePeerLogData,
          },
        });
        break;

      case 'closeButton':
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'client closed modal through button',
            ...this.userLogData,
            ...this.remotePeerLogData,
          },
        });
        break;

      case 'backdrop':
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'client closed modal through backdrop',
            ...this.userLogData,
            ...this.remotePeerLogData,
          },
        });
        break;
    }

    this.dialogRef.close();
  }

  public markActiveOption(option: CallRatingOption): void {
    this.selectedOption = option;
    this.form.patchValue({ selectedOption: this.selectedOption });
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true;
      const formValue = this.formUtils.pruneEmpty(this.form.value);

      if (this.selectedOption === 'ok') {
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'client had a good experience',
            ...formValue,
            ...this.userLogData,
            ...this.remotePeerLogData,
          },
        });
      } else {
        await this.logging.log({
          logLevel: 'info',
          data: {
            type: 'videoconferencing',
            functionType: 'videoconferencing-feedback',
            message: 'client had issues',
            ...formValue,
            ...this.userLogData,
            ...this.remotePeerLogData,
          },
        });
      }

      this.notifier.success(_('NOTIFY.SUCCESS.THANK_YOU_FEEDBACK'));
      this.close();
    } catch (error) {
      this.notifier.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private refreshCurrentUser(): void {
    this.currentUser = this.context.user;
    this.userLogData = {
      userId: this.currentUser.id,
      userEmail: this.currentUser.email,
      organizationId: this.context.organizationId,
      organizationName: this.context.organization.name,
    };
  }

  private createForm(): void {
    this.form = this.fb.group({
      selectedOption: ['', Validators.required],
      additionalComments: [''],
      coachDeviceIssue: [''],
      patientDeviceIssue: [''],
      couldNotConnect: [''],
      unexpectedCallDrop: [''],
      other: [''],
    });

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((formValue) => {
      this.preventClosing = true;
    });
  }

  private async startWindowTimeout(): Promise<void> {
    await sleep(15000);

    if (this.preventClosing) {
      return;
    }

    this.close('timeout');
  }
}
