import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@coachcare/common/material';
import { ActivatedRoute } from '@angular/router';
import {
  ActiveCampaignDatabase,
  ActiveCampaignDataSource,
} from '@coachcare/backend/data';
import { _ } from '@coachcare/backend/shared';
import { PromptDialog } from '@coachcare/common/dialogs/core';
import { ContextService } from '@coachcare/common/services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  AssociateActiveCampaignDialogComponent,
  EnrollProviderCampaignDialogComponent,
} from '../dialogs';
import { AssociateAllProvidersDialogComponent } from '../dialogs/associate-all-providers/associate-all-providers.dialog';

@Component({
  selector: 'ccr-organizations-active-campaign',
  templateUrl: './active-campaign.component.html',
  styleUrls: ['./active-campaign.component.scss'],
})
export class OrganizationActiveCampaignComponent implements OnDestroy, OnInit {
  public organizationId: string;
  public source: ActiveCampaignDataSource;

  constructor(
    private context: ContextService,
    private database: ActiveCampaignDatabase,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.source = new ActiveCampaignDataSource(this.database);
    this.source.addDefault({ status: 'active' });

    this.route.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.organizationId = data.org.id || this.context.organizationId;
      this.source.addDefault({ organization: this.organizationId, limit: 10 });
      this.source.refresh();
    });
  }

  public onAssociateActiveCampaign(): void {
    this.dialog
      .open(AssociateActiveCampaignDialogComponent, {
        data: { organizationId: this.organizationId },
        width: '60vw',
      })
      .afterClosed()
      .subscribe((refresh) => {
        if (!refresh) {
          return;
        }

        this.source.refresh();
      });
  }

  public onEnrollAllProviders(): void {
    this.dialog.open(AssociateAllProvidersDialogComponent, {
      data: { organizationId: this.organizationId },
      width: '60vw',
    });
  }

  public onEnrollProviderCampaign(): void {
    this.dialog.open(EnrollProviderCampaignDialogComponent, {
      data: { organizationId: this.organizationId },
      width: '60vw',
    });
  }
}
