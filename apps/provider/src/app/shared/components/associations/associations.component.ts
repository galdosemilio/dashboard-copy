import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormControl } from '@angular/forms'
import { MatDialog, MatPaginator } from '@coachcare/common/material'
import { AddAssociationDialog } from '@app/dashboard/accounts/dialogs/add-association'
import {
  AssociationsDatabase,
  AssociationsDataSource
} from '@app/dashboard/accounts/dieters/dieter/settings/services/associations'
import { ContextService, NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared/dialogs'
import { OrganizationAccess } from '@app/shared/selvera-api'
import { _ } from '@app/shared/utils'
import { OrganizationAssociation } from 'selvera-api'

@Component({
  selector: 'ccr-account-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss']
})
export class CcrAccountAssociationsComponent implements OnInit {
  @Input() account: string
  @Input() readonly = false
  @Input() showPermissions = false

  @ViewChild('paginator', { static: true }) paginator: MatPaginator

  columns: string[] = ['name', 'associatedAt', 'permissions', 'actions']
  formArray: FormArray
  hasAdmins = false
  results: OrganizationAccess[] = []
  source: AssociationsDataSource

  private initialValue: OrganizationAccess[]

  constructor(
    private context: ContextService,
    private database: AssociationsDatabase,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notify: NotifierService,
    private organizationAssociation: OrganizationAssociation
  ) {}

  ngOnInit(): void {
    if (this.readonly) {
      this.filterColumn('actions')
    }

    if (!this.showPermissions) {
      this.filterColumn('permissions')
    }

    this.account = this.account || this.context.accountId
    this.source = new AssociationsDataSource(
      this.database,
      this.context,
      this.paginator
    )
    this.source.addDefault({
      account: this.account,
      status: 'active',
      strict: true
    })
    this.source.connect().subscribe((results) => {
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
      .open(PromptDialog, {
        data: {
          title: _('ASSOCIATIONS.REMOVE_CLINIC_ASSOCIATION'),
          content: _('ASSOCIATIONS.REMOVE_ASSOCIATION_HELP')
        }
      })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (confirm) {
            await this.organizationAssociation.delete({
              account: this.account,
              organization: association.organization.id
            })
            this.paginator.firstPage()
            this.source.refresh()
          }
        } catch (error) {
          this.notify.error(error)
        }
      })
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
        viewAll: new FormControl(association.permissions.viewAll)
      })
      if (!association.canDelete) {
        formGroup.disable()
      }
      this.formArray.push(formGroup)
    })

    this.formArray.valueChanges.subscribe((controls) => {
      try {
        if (controls && controls.length) {
          controls.forEach(async (control, index) => {
            const initialAssoc = this.initialValue[index]
              ? this.initialValue[index]
              : undefined
            if (
              initialAssoc &&
              (control.admin !== initialAssoc.permissions.admin ||
                control.viewAll !== initialAssoc.permissions.viewAll)
            ) {
              this.initialValue[index] = {
                ...initialAssoc,
                permissions: control
              }
              await this.organizationAssociation.update({
                account: this.account,
                organization: initialAssoc.organization.id,
                isActive: true,
                permissions: control
              })
              this.notify.success(_('NOTIFY.SUCCESS.ASSOCIATION_UPDATED'))
            }
          })
        }
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
}
