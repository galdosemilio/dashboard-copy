// import { InjectionToken } from '@angular/core';

/**
 * Menu Injection Token
 */
// export const CCR_MENU = new InjectionToken<MenuItem[]>('ccr.menu');

/**
 * Interface for Menu Items
 */
export interface MenuItem {
  route?: string;
  navName: string;
  navRoute?: string;
  navLink?: string;
  icon?: string;
  children?: Array<MenuItem>;
  expanded?: boolean;
  cssClass?: string;
  badge?: number | string;
  unread?: number;
}
