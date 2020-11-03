/**
 * Angular Environment
 */
import { InjectionToken } from '@angular/core';
import { ApiEnvironment } from '@coachcare/backend/shared';

/**
 * Environment Injection Token
 */
export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('app.environment');

/**
 * App Environment
 */
export interface AppEnvironment extends ApiEnvironment {
  production: boolean;
  stripeKey: string;
  cdn: string;
  url: string;
  defaultOrgId: string;
}
