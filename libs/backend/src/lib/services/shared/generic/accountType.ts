/**
 * Account Type
 */
import { _ } from '@coachcare/backend/shared';

export type AccountTypeId = '1' | '2' | '3' | '4';

export type AccountTypeTitle = 'Client' | 'Provider' | 'Manager' | 'Admin';

export enum AccountTypeIds {
  Admin = '1',
  Provider = '2',
  Client = '3',
  Manager = '4'
}

export interface AccountTypeInfo {
  displayName?: string;
  id: AccountTypeId;
  title: AccountTypeTitle;
}

export interface AccountTypeDesc extends AccountTypeInfo {
  description: string;
}

// access types
export type AccAccessType = 'association' | 'assignment';

export enum AccAccessTypes {
  Assoc = 'association',
  Assig = 'assignment'
}

export const AccountTypes: { [key: string]: AccountTypeInfo } = {
  admin: {
    displayName: _('GLOBAL.ADMIN'),
    id: '1',
    title: 'Admin'
  },
  provider: {
    displayName: _('GLOBAL.PROVIDER'),
    id: '2',
    title: 'Provider'
  },
  client: {
    displayName: _('GLOBAL.CLIENT'),
    id: '3',
    title: 'Client'
  },
  manager: {
    displayName: _('GLOBAL.MANAGER'),
    id: '4',
    title: 'Manager'
  }
};
