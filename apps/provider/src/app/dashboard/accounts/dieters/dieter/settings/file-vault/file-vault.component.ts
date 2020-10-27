import { Component, OnInit } from '@angular/core';
import { ContextService, NotifierService } from '@app/service';
import { bufferedRequests } from '@app/shared';
import { Subject } from 'rxjs';
import { AssociationsDatabase, VaultDatabase, VaultDatasource } from '../services';

@Component({
  selector: 'app-dieter-file-vault',
  templateUrl: './file-vault.component.html',
  styleUrls: ['./file-vault.component.scss']
})
export class DieterFileVaultComponent implements OnInit {
  organizations: any[] = [];
  singleOrg: any;
  source: VaultDatasource;
  status: 'loading' | 'file-vault' | 'select-org' = 'loading';

  private singleOrg$: Subject<string> = new Subject<string>();

  constructor(
    private associationsDatabase: AssociationsDatabase,
    private context: ContextService,
    private database: VaultDatabase,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.source = new VaultDatasource(this.context, this.notifier, this.database);
    this.source.addDefault({ account: this.context.accountId });
    this.source.addOptional(this.singleOrg$, () => ({ organization: this.singleOrg.id }));
    this.fetchAccessibleOrganizations();
  }

  async selectOrganization(org: any) {
    const organization = await this.context.getOrg(org.id);
    if (organization) {
      this.singleOrg = organization;
      this.singleOrg$.next();
      this.status = 'file-vault';
    }
  }

  private async fetchAccessibleOrganizations() {
    try {
      const response = await this.associationsDatabase.fetch({
        account: this.context.accountId,
        status: 'active'
      });

      const permissionPromises = [];
      const allOrganizations = response.data.map(
        (association) => association.organization
      );

      allOrganizations.forEach((organization) => {
        permissionPromises.push(
          this.context.orgHasPerm(organization.id, 'allowClientPhi')
        );
      });

      const permissions = await bufferedRequests(permissionPromises);

      this.organizations = allOrganizations.filter((org, index) => permissions[index]);

      if (this.organizations.length === 1) {
        this.singleOrg = await this.context.getOrg(this.organizations[0].id);
      }

      this.status = this.organizations.length > 1 ? 'select-org' : 'file-vault';
    } catch (error) {
      this.notifier.error(error);
    }
  }
}
