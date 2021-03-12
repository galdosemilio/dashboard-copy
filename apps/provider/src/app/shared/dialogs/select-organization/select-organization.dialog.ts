import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { OrganizationEntity, OrganizationPermission } from '@coachcare/npm-api'

interface SelectOrganizationDialogProps {
  initialOrg?: OrganizationEntity
  permissions?: Partial<OrganizationPermission>
  title: string
}

@Component({
  selector: 'app-select-organization-dialog',
  templateUrl: './select-organization.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class SelectOrganizationDialog implements OnInit {
  public permissions: Partial<OrganizationPermission>
  public initialOrg: OrganizationEntity
  public selectedOrg?: OrganizationEntity

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SelectOrganizationDialogProps,
    private dialogRef: MatDialogRef<SelectOrganizationDialog>
  ) {}

  public ngOnInit(): void {
    this.initialOrg = this.data.initialOrg ?? null
    this.permissions = this.data.permissions ?? {}
  }

  public onSelectOrg(org): void {
    this.selectedOrg = org ?? undefined
  }

  public onSubmit(): void {
    this.dialogRef.close(this.selectedOrg)
  }
}
