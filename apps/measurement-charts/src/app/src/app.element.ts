import './app.element.scss'

import { baseData, BaseData, Tab, Timeframe, requiredWeightIds } from '../model'
import { api } from '../service/api'
import { eventService, tabService } from '@chart/service'
import { DateTime, Settings as LuxonSettings } from 'luxon'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import {
  DataPointTypes,
  MeasurementDataPointType,
  SYNTHETIC_TYPES
} from '@coachcare/sdk'

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
    const dataPointTypeId = params.get('dataPointTypeId')

    const data: BaseData = {
      dataPointTypeId,
      token: params.get('token'),
      accountId: params.get('accountId') || undefined,
      locale: params.get('locale') || baseData.locale,
      lastDate: params.get('lastDate') || DateTime.now().toFormat('yyyy-MM-dd'),
      timezone: params.get('timezone') || baseData.timezone,
      timeframe: (params.get('timeframe') as Timeframe) || baseData.timeframe,
      metric:
        (params.get('metric') as UserMeasurementPreferenceType) ||
        baseData.metric,
      view: (params.get('view') as Tab) || Tab.LIST,
      colors: {
        primary: params.get('primary-color') || baseData.colors.primary,
        accent: params.get('accent-color') || baseData.colors.accent,
        text: params.get('text-color') || baseData.colors.text
      },
      dataPointTypes: [],
      sourceId: params.get('sourceId') || undefined
    }

    this.onMessage(data)
  }

  private async onMessage(data: BaseData) {
    api.setToken(data.token)

    let dataPointTypeIds = [data.dataPointTypeId]

    const syntheticType = SYNTHETIC_TYPES.find(
      (t) => t.id === data.dataPointTypeId
    )

    if (syntheticType) {
      dataPointTypeIds = syntheticType.sourceTypeIds
    }

    const isRequiredWeight = requiredWeightIds.some((requiredWeightId) =>
      dataPointTypeIds.includes(requiredWeightId)
    )

    if (isRequiredWeight) {
      dataPointTypeIds = (dataPointTypeIds as DataPointTypes[]).concat([
        DataPointTypes.WEIGHT
      ])
    }

    const dataPointTypes: MeasurementDataPointType[] = []

    for (const id of dataPointTypeIds) {
      const res = await api.measurementDataPointType.getSingle({
        id
      })

      dataPointTypes.push(res)
    }

    this.setLayout(data)
    this.setDateTimeSettings(data)

    if (!data.lastDate) {
      data.lastDate = DateTime.now().toFormat('yyyy-MM-dd')
    }

    data.isWeightRequired = isRequiredWeight
    data.dataPointTypes = dataPointTypes

    api.appendBaseData(data)
    this.setColorPattern()

    tabService.selectedTab$.next(data.view)
    eventService.baseDataEvent$.next(data)
  }

  private setColorPattern() {
    document.body.setAttribute(
      'style',
      `
        --primary: ${api.baseData.colors.primary};
        --accent: ${api.baseData.colors.accent};
        --text: ${api.baseData.colors.text};
        --selector-background: #383838;
        --selector-background-light: #f5f5f5;
        --selector-contrast: #dedede;
        --gray-light: rgb(247, 247, 247);
        --gray: rgb(155,155,155)
      `
    )
  }

  private setDateTimeSettings(data: BaseData) {
    LuxonSettings.defaultLocale = data.locale
    LuxonSettings.defaultZoneName = data.timezone
  }

  private setLayout(data: BaseData) {
    const dir = data.locale === 'ar' || data.locale === 'he' ? 'rtl' : 'ltr'
    document.body.setAttribute('dir', dir)
  }
}

customElements.define('dashboard-root', AppElement)
