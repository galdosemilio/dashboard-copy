import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { sleep } from '@app/shared/utils';

export interface WalkthroughDialogProps {
  title: string;
  guideUrl: string;
  shouldAutoClose?: boolean;
}

@Component({
  selector: 'app-dialog-walkthrough',
  templateUrl: './walkthrough.dialog.html',
  styleUrls: ['./walkthrough.dialog.scss'],
  host: { class: 'ccr-dialog' },
})
export class WalkthroughDialog implements OnInit {
  @HostListener('window:message', ['$event'])
  async onGuideMessage(message: MessageEvent): Promise<void> {
    if (message.data.type === 'guide:end' && this.shouldAutoClose) {
      await sleep(3000);
      this.dialogRef.close();
    }
  }

  public title: string = '';
  public guideUrl: SafeResourceUrl = '';

  private shouldAutoClose: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: WalkthroughDialogProps,
    private dialogRef: MatDialogRef<WalkthroughDialog>,
    private sanitizer: DomSanitizer
  ) {}

  public ngOnInit(): void {
    this.guideUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.data.guideUrl
    );
    this.title = this.data.title || '';
    this.shouldAutoClose = this.data.shouldAutoClose;
  }
}
