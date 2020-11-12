/**
 * App Configuration
 */
import { AppConfig } from '@coachcare/common/shared'
import { apiSettings } from './api.config'
import { appSettings } from './app.config'
import { appMenu } from './menu.config'

export const projectConfig: AppConfig = {
  api: apiSettings,
  app: appSettings,
  menu: {
    admin: appMenu
  }
}
