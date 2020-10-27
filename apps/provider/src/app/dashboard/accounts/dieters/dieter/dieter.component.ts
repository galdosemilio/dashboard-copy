import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@coachcare/common/material';
import { ActivatedRoute } from '@angular/router';
import { resolveConfig } from '@app/config/section';
import { ContextService, NotifierService } from '@app/service';
import { RPMPatientReportDialog } from '@app/shared';
import { AccSingleResponse } from '@app/shared/selvera-api';
import { get, intersectionBy } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { DieterDashboardSummary, Organization, RPM } from 'selvera-api';
import { DoctorPDFDialog, ProgressReportPDFDialog } from '../../dialogs';

@Component({
  selector: 'app-dieter',
  templateUrl: './dieter.component.html',
})
export class DieterComponent implements OnDestroy, OnInit {
  public dieter: AccSingleResponse;
  public hasRPMEnabled: boolean;
  public patientIsForeign: boolean;
  public showDoctorPDFButton: boolean;
  public showMessaging: boolean;
  public showPatientPDFButton: boolean;
  public showRPM: boolean;

  constructor(
    private context: ContextService,
    private data: DieterDashboardSummary,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private organization: Organization,
    private route: ActivatedRoute,
    private rpm: RPM
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.data.init(this.context.accountId);
    this.route.data.forEach((data: any) => {
      this.dieter = data.account;
    });

    this.context.account$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.resolvePatientRPMStatus());

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.showDoctorPDFButton = resolveConfig(
          'JOURNAL.SHOW_DOCTOR_PDF_BUTTON',
          organization
        );
        this.showMessaging = get(
          organization,
          'preferences.messaging.isActive',
          false
        );
        this.showRPM = get(organization, 'preferences.rpm.isActive', false);
        this.showPatientPDFButton = resolveConfig(
          'JOURNAL.SHOW_PATIENT_PDF_BUTTON',
          organization
        );

        this.resolvePatientForeigness();
        this.resolvePatientRPMStatus();
      });
  }

  public openPatientRpmReportDialog(): void {
    this.dialog.open(RPMPatientReportDialog, { width: '50vw' });
  }

  public onShowDoctorPDFModal(): void {
    this.dialog.open(DoctorPDFDialog);
  }

  public onShowProgressPDFModal(): void {
    this.dialog.open(ProgressReportPDFDialog);
  }

  private async resolvePatientForeigness(): Promise<void> {
    try {
      const descendants = (
        await this.organization.getDescendants({
          organization: this.context.organizationId,
          limit: 'all',
        })
      ).data;

      const accountOrgs = this.context.account.organizations;

      const accountOrgsInHierarchy = intersectionBy(
        [this.context.organization, ...descendants],
        accountOrgs,
        'id'
      );

      this.patientIsForeign = accountOrgsInHierarchy.length <= 0;
    } catch (error) {
      this.notifier.error(error);
    }
  }

  private async resolvePatientRPMStatus(): Promise<void> {
    try {
      const rpmEntries = await this.rpm.getList({
        account: this.context.accountId,
        organization: this.context.organizationId,
        offset: 0,
        limit: 1,
      });

      if (!rpmEntries.data.length) {
        this.hasRPMEnabled = false;
        return;
      }

      this.hasRPMEnabled = rpmEntries.data.shift().isActive || false;
    } catch (error) {
      this.notifier.error(error);
    }
  }
}
