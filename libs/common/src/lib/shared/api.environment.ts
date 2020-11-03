/**
 * ApiModule
 */
import { InjectionToken } from '@angular/core';
import { CcrEnv } from './ccr.types';

/**
 * Environment Injection Token
 */
export const API_ENVIRONMENT = new InjectionToken<ApiEnvironment>('api.environment');

/**
 * Api Environment
 */
export interface ApiEnvironment {
  apiUrl: string;
  appName: string;
  appVersion: string;
  ccrApiEnv: CcrEnv;
  cookieDomain: string;
}
