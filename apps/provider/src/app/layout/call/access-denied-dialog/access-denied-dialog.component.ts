import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'access-denied-dialog',
  templateUrl: './access-denied-dialog.component.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class AccessDeniedDialogComponent {}
