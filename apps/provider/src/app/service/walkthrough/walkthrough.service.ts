import { Injectable } from '@angular/core';
import { MatDialog } from '@coachcare/common/material';
import { WalkthroughDialog } from '@app/shared/dialogs/walkthrough';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { ContextService } from '../context.service';
import { NotifierService } from '../notifier.service';
import { WALKTHROUGHS } from './consts';

interface OpenWalkthroughOpts {
  shouldAutoClose: boolean;
}

@Injectable()
export class WalkthroughService {
  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {}

  public checkGuideState(name: 'dashboard' | 'rpm'): void {
    try {
      const storageProp = WALKTHROUGHS[name].storageItem;
      const hasSeenGuide = window.localStorage.getItem(storageProp);

      if (hasSeenGuide) {
        return;
      }

      const userCreateDate = this.context.user.createdAt;

      // only use this check for the dashboard walkthrough - set no time limit on when to show the rpm guide
      if (
        name === 'dashboard' &&
        Math.abs(moment(userCreateDate).diff(moment(), 'days')) >= 7
      ) {
        return;
      }

      this.openWalkthrough(name);
      window.localStorage.setItem(storageProp, 'true');
    } catch (error) {
      this.notifier.error(error);
    }
  }

  public openWalkthrough(
    name: string,
    opts: OpenWalkthroughOpts = { shouldAutoClose: true }
  ): void {
    const lang = this.translate.currentLang.split('-')[0];
    const walkthrough = WALKTHROUGHS[name];

    this.dialog.open(WalkthroughDialog, {
      data: {
        title: walkthrough.title,
        guideUrl: walkthrough.urls[lang] || walkthrough.urls['en'],
        shouldAutoClose: opts.shouldAutoClose,
      },
      disableClose: true,
      height: '95vh',
      panelClass: 'ccr-walkthrough-dialog',
      width: '98vw',
    });
  }
}
