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

export const PagesProviders = []

export const PagesRoutings = [
  AppDownloadGuard,
  PasswordUpdateGuard,
  RouteWildcardGuard,
  SessionGuard
]
