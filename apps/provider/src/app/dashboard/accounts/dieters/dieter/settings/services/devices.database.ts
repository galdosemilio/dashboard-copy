import { Injectable } from '@angular/core';
import { Authentication } from 'selvera-api';

import { ContextService } from '@app/service';
import { CcrDatabase } from '@app/shared';
import {
  AuthAvailableResponse,
  AuthenticationService,
  DeviceSyncResponse
} from '@app/shared/selvera-api';

@Injectable()
export class DevicesDatabase extends CcrDatabase {
  constructor(private authentication: Authentication, private context: ContextService) {
    super();
  }

  available(dieterId: string): Promise<AuthAvailableResponse> {
    return this.authentication.available(dieterId);
  }

  lastActivity(dieterId: string): Promise<DeviceSyncResponse> {
    return this.authentication.lastActivity(dieterId);
  }
}
