import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import {
  ActiveCampaignDataSource,
  ActiveCampaignListItem
} from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { _, SelectorOption } from '@coachcare/backend/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { PromptDialog } from '@coachcare/common/dialogs/core'
import { NotifierService } from '@coachcare/common/services'
import { debounceTime, filter } from 'rxjs/operators'
import { ActiveCampaign } from '@coachcare/sdk'
import { EditActiveCampaignDialogComponent } from '../../dialogs'

@Component({
  selector: 'ccr-organizations-active-campaign-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class OrganizationActiveCampaignTableComponent
  implements OnDestroy, OnInit {
  @Input() source: ActiveCampaignDataSource

  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public columns: string[] = [
    'id',
    'name',
    'organizationId',
    'organizationName',
    'status',
    'actions'
  ]
  public form: FormGroup
  public statusOptions: SelectorOption[] = [
    {
      value: 'all',
      viewValue: _('GLOBAL.ALL')
    },
    {
      value: 'active',
      viewValue: _('GLOBAL.ACTIVE')
    },
    {
      value: 'inactive',
      viewValue: _('GLOBAL.INACTIVE')
    }
  ]

  constructor(
    private activeCampaign: ActiveCampaign,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnDestroy(): void {
    this.source.unsetPaginator()
    this.source.unregister('statusFilter')
  }

  public ngOnInit(): void {
    this.createForm()
    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))
    this.source.register(
      'statusFilter',
      false,
      this.form.controls.status.valueChanges.pipe(debounceTime(200)),
      () => ({
        status: this.form.value.status
      })
    )
  }

  public onDelete(entry: ActiveCampaignListItem): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('ADMIN.ORGS.DELETE_LIST_ASSOCIATION'),
          content: _('ADMIN.ORGS.DELETE_LIST_ASSOCIATION_CONTENT'),
          contentParams: { list: entry.name }
        },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(async () => {
        try {
          await this.activeCampaign.deleteListAssociation({ id: entry.id })
          this.notifier.success(_('NOTIFY.SUCCESS.ACTIVE_CAMPAIGN_DELETED'))
          this.source.refresh()
        } catch (error) {
          this.notifier.error(error)
        }
      })
  }

  public onEdit(entry: ActiveCampaignListItem): void {
    this.dialog
      .open(EditActiveCampaignDialogComponent, {
        data: { activeCampaign: entry },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  private createForm(): void {
    this.form = this.fb.group({
      status: ['all', Validators.required]
    })
  }
}
