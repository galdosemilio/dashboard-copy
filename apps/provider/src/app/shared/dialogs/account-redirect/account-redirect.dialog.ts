import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { Router } from '@angular/router'
import { AccountTypeId } from '@coachcare/sdk'

interface AccountRedirectDialogProps {
  account: any
  accountType: string
}

@Component({
  selector: 'app-dialog-account-redirect-dialog',
  templateUrl: './account-redirect.dialog.html',
  styleUrls: ['./account-redirect.dialog.scss'],
  host: {
    class: 'ccr-dialog'
  }
})
export class AccountRedirectDialog implements OnInit {
  accountType: string
  accountId: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AccountRedirectDialogProps,
    private dialog: MatDialogRef<AccountRedirectDialog>,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.accountId = this.data.account.id
      this.accountType = this.data.accountType
    }
  }

  goToAssociationListing(): void {
    if (this.accountType === AccountTypeId.Client) {
      void this.router.navigate([
        '/accounts/patients',
        this.accountId,
        'settings',
        { s: 'associations' }
      ])
    } else if (this.accountType === AccountTypeId.Provider) {
      void this.router.navigate([
        '/accounts/coaches',
        this.accountId,
        'profile'
      ])
    }

    this.dialog.close()
  }
}
