/**
 * Layout Search
 */
import { InjectionToken } from '@angular/core';

/**
 * Search Providers Injection Token
 * Must provide an array of SearchDataSources
 */
export const APP_SEARCH_SOURCE = new InjectionToken<any>('app.search.source');
