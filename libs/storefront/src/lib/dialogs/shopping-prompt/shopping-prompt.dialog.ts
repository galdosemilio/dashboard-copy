import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { UntilDestroy } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-shopping-prompt-dialog',
  templateUrl: './shopping-prompt.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./shopping-prompt.dialog.scss']
})
export class StorefrontShoppingPromptDialog {
  constructor(private dialogRef: MatDialogRef<'cart' | 'category'>) {
    dialogRef.disableClose = true
  }

  public goToPage(page: 'cart' | 'category') {
    this.dialogRef.close(page)
  }
}
