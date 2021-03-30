import { Component, Inject, OnInit } from '@angular/core'
import { ContextService } from '@app/service'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { NamedEntity } from '@coachcare/npm-api'
import { Account, Organization } from '@coachcare/npm-api/selvera-api/services'

interface AddSupervisingProviderDialogProps {
  clinic: NamedEntity
}

@Component({
  selector: 'add-supervising-provider-dialog',
  templateUrl: './add-supervising-provider.dialog.html',
  styleUrls: ['./add-supervising-provider.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class AddSupervisingProviderDialog implements OnInit {
  public clinic: NamedEntity
  public hasPhi = false
  public selectedAccount

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: AddSupervisingProviderDialogProps,
    private dialogRef: MatDialogRef<AddSupervisingProviderDialog>,
    private organization: Organization
  ) {}

  public ngOnInit(): void {
    this.clinic = this.data.clinic
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedAccount)
  }

  public async onUserSelect(account) {
    this.selectedAccount = account
    const response = await this.organization.getAccessibleList({
      account: this.selectedAccount.id,
      permissions: { allowClientPhi: true },
      limit: 'all'
    })
    this.hasPhi = response.data.some(
      (entry) => entry.organization.id === this.context.clinic.id
    )
  }
}
