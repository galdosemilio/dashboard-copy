import { MAT_LABEL_GLOBAL_OPTIONS } from '@coachcare/material'
import { AppDownloadGuard } from '@board/pages/services/app-download.guard'
import { PasswordUpdateGuard } from '@board/pages/services/password-update.guard'
import { RouteWildcardGuard } from '@board/pages/services/route-wildcard.guard'
import { SessionGuard } from '@board/pages/services/session.guard'

export {
  AppDownloadGuard,
  PasswordUpdateGuard,
  RouteWildcardGuard,
  SessionGuard
}

export const PagesProviders = [
  { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
]

export const PagesRoutings = [
  AppDownloadGuard,
  PasswordUpdateGuard,
  RouteWildcardGuard,
  SessionGuard
]
