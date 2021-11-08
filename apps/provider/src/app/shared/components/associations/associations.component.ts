import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl } from '@angular/forms'
import { MatDialog, MatPaginator } from '@coachcare/material'
import { AddAssociationDialog } from '@app/dashboard/accounts/dialogs/add-association'
import {
  AssociationsDatabase,
  AssociationsDataSource
} from '@app/dashboard/accounts/dieters/dieter/settings/services/associations'
import { ContextService, NotifierService } from '@app/service'
import {
  CoachPermissionsDialog,
  RemoveClinicAssociationDialog
} from '@app/shared/dialogs'
import { _ } from '@app/shared/utils'
import {
  AccountAccessData,
  OrganizationAccess,
  OrganizationAssociation,
  OrganizationProvider,
  OrganizationWithAddress,
  Schedule
} from '@coachcare/sdk'
import { filter } from 'rxjs/operators'
import {
  AssociationAccessLevel,
  COACH_ASSOCIATION_ACCESS_LEVELS,
  convertPermissionsToAccessLevel
} from '@app/shared/model/accessLevels'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { confirmRemoveAssociatedMeetings } from '@app/dashboard/accounts/dieters/helpers'

@UntilDestroy()
@Component({
  selector: 'ccr-account-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss']
})
export class CcrAccountAssociationsComponent implements OnInit {
  @Input() account: AccountAccessData
  @Input() readonly = false
  @Input() showPermissions = false

  @ViewChild('paginator', { static: true }) paginator: MatPaginator

  columns: string[] = ['name', 'associatedAt', 'permissions', 'actions']
  formArray: FormArray
  hasAdmins = false
  permissionLevels: AssociationAccessLevel[] = Object.values(
    COACH_ASSOCIATION_ACCESS_LEVELS
  )
  results: OrganizationAccess[] = []
  source: AssociationsDataSource

  private initialValue: OrganizationAccess[]
  private ignoreChanges: boolean

  constructor(
    private context: ContextService,
    private database: AssociationsDatabase,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notify: NotifierService,
    private organization: OrganizationProvider,
    private organizationAssociation: OrganizationAssociation,
    private schedule: Schedule
  ) {
    this.syncControl = this.syncControl.bind(this)
  }

  ngOnInit(): void {
    if (this.readonly) {
      this.filterColumn('actions')
    }

    if (!this.showPermissions) {
      this.filterColumn('permissions')
    }

    this.account = this.account || this.context.account
    this.source = new AssociationsDataSource(
      this.database,
      this.context,
      this.paginator
    )
    this.source.addDefault({
      account: this.account.id,
      status: 'active',
      strict: true
    })
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((results) => {
        if (this.showPermissions) {
          this.generateFormArray(results)
        }
        this.results = results
      })
    this.checkIfProviderHasAdmin()
  }

  onAddAssociation(): void {
    this.dialog
      .open(AddAssociationDialog, {
        panelClass: 'ccr-full-dialog',
        width: '80vw'
      })
      .afterClosed()
      .subscribe((reload) => {
        if (reload) {
          this.paginator.firstPage()
          this.source.refresh()
        }
      })
  }

  onDeleteAssociation(association: any): void {
    if (!association.canDelete) {
      return
    }
    this.dialog
      .open(RemoveClinicAssociationDialog, {
        data: {
          organizationId: association.organization.id
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.deleteAssociation(association.organization))
  }

  private async deleteAssociation(
    organization: OrganizationWithAddress
  ): Promise<void> {
    try {
      const response = await this.organization.getAccessibleList({
        account: this.account.id,
        status: 'active',
        strict: true,
        limit: 'all'
      })

      const confirmed = await confirmRemoveAssociatedMeetings({
        account: this.account,
        dialog: this.dialog,
        organizationId: organization.id,
        organizations: response.data,
        schedule: this.schedule
      })

      if (!confirmed) {
        return
      }

      await this.organizationAssociation.delete({
        account: this.account.id,
        organization: organization.id
      })
      this.paginator.firstPage()
      this.source.refresh()
    } catch (error) {
      this.notify.error(error)
    }
  }

  public showPermissionsDialog(): void {
    this.dialog.open(CoachPermissionsDialog)
  }

  private filterColumn(column: string): void {
    const index = this.columns.findIndex((c) => c === column)
    if (index > -1) {
      this.columns.splice(index, 1)
    }
  }

  private generateFormArray(results: OrganizationAccess[]): void {
    if (!this.formArray) {
      this.formArray = this.fb.array([])
    }
    this.initialValue = results

    this.formArray = this.fb.array([])
    this.formArray.reset()

    results.forEach((association: any) => {
      const formGroup = this.fb.group({
        admin: new FormControl(association.permissions.admin),
        access: new FormControl(
          convertPermissionsToAccessLevel(association.permissions)
        )
      })
      if (!association.canDelete) {
        formGroup.disable()
      }
      this.formArray.push(formGroup)
    })

    this.formArray.valueChanges
      .pipe(
        untilDestroyed(this),
        filter(() => !this.ignoreChanges)
      )
      .subscribe((controls) => {
        try {
          controls?.forEach(this.syncControl)
        } catch (error) {
          this.notify.error(error)
        }
      })
  }

  private async checkIfProviderHasAdmin() {
    try {
      const hasAdmins =
        (
          await this.database.fetch({
            account: this.context.user.id,
            limit: 1,
            offset: 0,
            permissions: { admin: true },
            status: 'active'
          })
        ).data.length > 0
      this.hasAdmins = hasAdmins
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async syncControl(control, index): Promise<void> {
    const currentPerms =
      COACH_ASSOCIATION_ACCESS_LEVELS[control.access]?.perms ?? null

    try {
      const initialAssoc = this.initialValue[index]
        ? this.initialValue[index]
        : undefined

      if (
        !initialAssoc ||
        (control.admin === initialAssoc.permissions.admin &&
          currentPerms.viewAll === initialAssoc.permissions.viewAll &&
          currentPerms.allowClientPhi ===
            initialAssoc.permissions.allowClientPhi)
      ) {
        return
      }

      // we handle it separately because the admin toggle is independent
      if (control.admin !== initialAssoc.permissions.admin) {
        await this.organizationAssociation.update({
          account: this.account.id,
          organization: initialAssoc.organization.id,
          isActive: true,
          permissions: { admin: control.admin }
        })
      } else {
        await this.organizationAssociation.update({
          account: this.account.id,
          organization: initialAssoc.organization.id,
          isActive: true,
          permissions: currentPerms
        })
      }

      this.initialValue[index] = {
        ...initialAssoc,
        permissions: { ...currentPerms, admin: control.admin }
      }

      this.notify.success(_('NOTIFY.SUCCESS.ASSOCIATION_UPDATED'))
    } catch (error) {
      this.ignoreChanges = true
      this.formArray.controls[index]
        .get('access')
        .patchValue(
          convertPermissionsToAccessLevel(this.initialValue[index].permissions),
          { emitEvent: false }
        )
      this.notify.error(error)
      this.ignoreChanges = false
    }
  }
}
