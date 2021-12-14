import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import {
  ActiveCampaignDatabase,
  ActiveCampaignDataSource
} from '@coachcare/backend/data'
import { ContextService, NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  AssociateActiveCampaignDialogComponent,
  EnrollProviderCampaignDialogComponent
} from '../dialogs'
import { AssociateAllProvidersDialogComponent } from '../dialogs/associate-all-providers/associate-all-providers.dialog'
import { OrganizationPreference } from '@coachcare/sdk'
import { FormBuilder, FormGroup } from '@angular/forms'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-active-campaign',
  templateUrl: './active-campaign.component.html',
  styleUrls: ['./active-campaign.component.scss']
})
export class OrganizationActiveCampaignComponent implements OnDestroy, OnInit {
  public activeCampaignIsEnabled: boolean
  public form: FormGroup
  public isLoading: boolean
  public organizationId: string
  public source: ActiveCampaignDataSource

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: ActiveCampaignDatabase,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference,
    private route: ActivatedRoute
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createActiveCampaignForm()
    this.source = new ActiveCampaignDataSource(this.database)
    this.source.addDefault({ status: 'active' })

    this.route.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.organizationId = data.org.id || this.context.organizationId
      this.source.addDefault({ organization: this.organizationId, limit: 10 })
      this.source.refresh()
      void this.resolveActiveCampaignStatus()
    })
  }

  public createActiveCampaignForm(): void {
    this.form = this.fb.group({
      useActiveCampaign: []
    })

    this.form.controls.useActiveCampaign.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((enabledState) => this.setActiveCampaignState(enabledState))
  }

  public async setActiveCampaignState(state: boolean): Promise<void> {
    try {
      this.isLoading = true
      await this.organizationPreference.update({
        id: this.organizationId,
        useActiveCampaign: state
      })
      this.activeCampaignIsEnabled = state

      if (state) {
        this.source.refresh()
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.cdr.detectChanges()
    }
  }

  public onAssociateActiveCampaign(): void {
    this.dialog
      .open(AssociateActiveCampaignDialogComponent, {
        data: { organizationId: this.organizationId },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  public onEnrollAllProviders(): void {
    this.dialog.open(AssociateAllProvidersDialogComponent, {
      data: { organizationId: this.organizationId },
      width: '60vw'
    })
  }

  public onEnrollProviderCampaign(): void {
    this.dialog.open(EnrollProviderCampaignDialogComponent, {
      data: { organizationId: this.organizationId },
      width: '60vw'
    })
  }

  private async resolveActiveCampaignStatus(): Promise<void> {
    try {
      const preference = await this.organizationPreference.getSingle({
        id: this.organizationId
      })

      this.activeCampaignIsEnabled = preference.useActiveCampaign || false
      this.form.controls.useActiveCampaign.setValue(
        preference.useActiveCampaign,
        { emitEvent: false }
      )
      this.cdr.detectChanges()
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
