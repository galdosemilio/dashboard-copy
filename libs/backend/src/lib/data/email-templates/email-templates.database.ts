import { Injectable } from '@angular/core';
import { AppDatabase } from '@coachcare/backend/model';
import { PagedResponse } from '@coachcare/backend/services';
import { from, Observable } from 'rxjs';
import { Organization } from 'selvera-api';
import { EmailTemplate } from 'selvera-api/dist/lib/selvera-api/providers/organization/entities';
import { GetAllEmailTemplatesRequest } from 'selvera-api/dist/lib/selvera-api/providers/organization/requests';

@Injectable()
export class EmailTemplatesDatabase extends AppDatabase {
  constructor(private organization: Organization) {
    super();
  }

  fetch(criteria: GetAllEmailTemplatesRequest): Observable<PagedResponse<EmailTemplate>> {
    return from(this.organization.getAllEmailTemplates(criteria));
  }
}
