// import { Sort } from 'selvera-pg';

export * from './accountTitle'
export * from './activityEvent'
export * from './loginHistoryItem'
export * from './sort.interface'

export type AccountMeasurementPreferenceType = 'metric' | 'us' | 'uk'

export type AccountTypeTitle = 'Client' | 'Provider' | 'Admin' | 'Manager'

export interface AccountRef {
  id: string
  firstName: string
  lastName: string
}

export enum AccountTypeIds {
  Admin = '1',
  Provider = '2',
  Client = '3',
  Manager = '4'
}

export enum AccountTypeId {
  Admin = '1',
  Provider = '2',
  Client = '3',
  Manager = '4'
}

export interface AccountTypeInfo {
  id: string
  title: AccountTypeTitle
}

export interface AccountTypeDesc extends AccountTypeInfo {
  description: string
}

export type Gender = 'male' | 'female'
export const genders: Gender[] = ['male', 'female']

export interface ClientData {
  birthday: string
  height: number
  gender: Gender
  bmr: number | null
  startedAt?: string
}

export type PhoneType = 'android' | 'ios'

export interface AccountCoreData {
  firstName: string
  lastName: string
  email: string
}

export interface Account extends AccountCoreData {
  id: string
  accountType: AccountTypeInfo
}

export interface AccountAccessOrganization {
  createdAt?: string
  id: string
  name: string
  accessType: string
}

export enum AccAccessTypes {
  Assoc = 'association',
  Assig = 'assignment'
}

// account organization association data
export interface AccountAssociationData {
  id: string
  name: string
  accessType: AccAccessTypes
  createdAt: string
}

export interface AccountAccessData extends Account {
  organizations: Array<AccountAccessOrganization>
}

export interface AccountFullData extends Account {
  createdAt: string
  isActive: boolean
  measurementPreference: AccountMeasurementPreferenceType
  timezone: string
  phone: string | null
  countryCode: string | null
  phoneType: PhoneType | null
  preferredLocales?: Array<string>
}

export interface AccountSingle extends AccountFullData {}

export type AccountPreferenceType = 'list' | 'calendar:month' | 'calendar:day'

export interface AccountPreferences {
  calendarView?: AccountPreferenceType
  defaultOrganization?: string
  healthyBadgeStation?: string
}

export type AccSortProperties = Pick<
  Account,
  'email' | 'firstName' | 'lastName'
>

export const accSortProperties: (keyof AccSortProperties)[] = [
  'email',
  'firstName',
  'lastName'
]
/*
export interface SortedRequest {
    sort?: Sort<SortProperties>[];
}
*/
