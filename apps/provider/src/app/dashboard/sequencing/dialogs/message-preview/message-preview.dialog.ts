import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@coachcare/common/material';
import { MessageType, MessageTypes } from '../../models';

interface MessagePreviewDialogProps {
  type: string;
}

@Component({
  selector: 'sequencing-message-preview-dialog',
  templateUrl: './message-preview.dialog.html',
  styleUrls: ['./message-preview.dialog.scss'],
  host: { class: 'ccr-dialog' },
})
export class MessagePreviewDialog {
  type: MessageType;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MessagePreviewDialogProps
  ) {
    const messageKey = Object.keys(MessageTypes).find(
      (key) => MessageTypes[key].id === this.data.type
    );
    if (messageKey) {
      this.type = MessageTypes[messageKey];
    }
  }
}
