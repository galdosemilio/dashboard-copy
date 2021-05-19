import './app.element.scss'

import { baseData, BaseData, Tab, Timeframe } from '../model'
import { api } from '../service/api'
import { eventService } from '@chart/service'
import { Settings as LuxonSettings } from 'luxon'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import { tabService } from '@chart/service/tab/tab.service'

export class AppElement extends HTMLElement {
  constructor() {
    super()
    this.setColorPattern()
  }

  connectedCallback() {
    this.innerHTML = `
      <dashboard-nav></dashboard-nav>
      <dashboard-modal></dashboard-modal>
    `

    document.addEventListener('message', (event: Event) => {
      this.onMessage(JSON.parse(event['data']) as BaseData)
    })

    if (!window.location.search) {
      return
    }

    const params = new URLSearchParams(window.location.search)

    const data: BaseData = {
      token: params.get('token'),
      dataPointTypeId: params.get('dataPointTypeId'),
      accountId: params.get('accountId') ?? undefined,
      locale: params.get('locale') ?? baseData.locale,
      timezone: params.get('timezone') ?? baseData.timezone,
      timeframe: (params.get('timeframe') as Timeframe) ?? baseData.timeframe,
      metric:
        (params.get('metric') as UserMeasurementPreferenceType) ??
        baseData.metric,
      view: (params.get('view') as Tab) ?? Tab.LIST,
      colors: {
        primary: params.get('primary-color') ?? baseData.colors.primary,
        accent: params.get('accent-color') ?? baseData.colors.accent,
        text: params.get('text-color') ?? baseData.colors.text
      }
    }

    tabService.selectedTab$.next(data.view)

    this.onMessage(data)
  }

  private onMessage(data: BaseData) {
    api.appendBaseData(data)
    this.setColorPattern()
    this.setLayout(data)
    this.setDateTimeSettings()
    api.setToken(data.token)
    eventService.baseDataEvent$.next(data)
  }

  private setColorPattern() {
    document.body.setAttribute(
      'style',
      `
        --primary: ${baseData.colors.primary};
        --accent: ${baseData.colors.accent};
        --text: ${baseData.colors.text};
        --selector-background: #383838;
        --selector-background-light: #f5f5f5;
        --selector-contrast: #dedede;
      `
    )
  }

  private setDateTimeSettings() {
    LuxonSettings.defaultLocale = api.baseData.locale
    LuxonSettings.defaultZoneName = api.baseData.timezone
  }

  private setLayout(data: BaseData) {
    const dir = data.locale === 'ar' || data.locale === 'he' ? 'rtl' : 'ltr'
    document.body.setAttribute('dir', dir)
  }
}

customElements.define('dashboard-root', AppElement)
