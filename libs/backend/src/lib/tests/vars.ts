import { adminCred, clientCred, coachCred, TestCred } from '@coachcare/testing'
import { TestState } from './state'

/**
 * Settings
 */

export const org = {
  id: '1',
  name: 'Selvera',
  shortcode: 'selvera'
}

// TODO setup org without permissions

/**
 * Interfaces
 */

export type TestToken = 'Admin' | 'Provider' | 'Client'

export interface TestRole {
  id: string
  token: TestToken
}

export type TestUsers = { [K in 'admin' | 'provider' | 'client']: TestRole }

export type TestCreds = { [K in TestToken]: TestCred }

export type TestVars = { [K in TestToken]: TestState }

/**
 * Roles
 */

export const user = Object.freeze<TestUsers>({
  admin: { id: '1', token: 'Admin' },
  provider: { id: '3', token: 'Provider' },
  client: { id: '4', token: 'Client' }
})

export const allUsers = Object.freeze([user.admin, user.provider, user.client])

export const cred = Object.freeze<TestCreds>({
  Admin: adminCred,
  Provider: coachCred,
  Client: clientCred
})

/**
 * State
 */

export const state = {
  role: '',
  Admin: new TestState(),
  Provider: new TestState(),
  Client: new TestState()
}
