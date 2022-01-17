import { CcrElement, ListItem } from '@chart/model'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
import {
  convertToReadableFormat,
  DataPointTypes,
  MeasurementDataPointGroup
} from '@coachcare/sdk'
import { DateTime } from 'luxon'
import * as utils from '@chart/utils'

import './list-details.element.scss'
import { translate } from '@chart/service/i18n'

export class ListDetailsElement extends CcrElement {
  listItem: ListItem
  groupData: MeasurementDataPointGroup[] = []

  constructor() {
    super()
    this.onOpenDetails = this.onOpenDetails.bind(this)
  }

  render() {
    this.innerHTML = `
      <div id="list-details">
        <div class='list-detail-header'>
          <div id='list-detail-back-btn' class='list-detail-back-btn'>
            <img src='assets/img/arrow-right.svg' />
          </div>
          <p id='list-detail-title' class='list-detail-title'></p>
        </div>
        <div id='list-detail-date' class='list-detail-date'></div>
        <div class='list-detail-content'>
          <div id='list-detail-items' class='list-detail-items'></div>
        </div>
      </div>
    `
  }

  afterViewInit() {
    eventService.listen<ListItem>('list.details').subscribe(this.onOpenDetails)

    document
      .getElementById('list-detail-back-btn')
      .addEventListener('click', () => {
        document.getElementById('list-details').className = ''
      })
  }

  private renderItems(): void {
    const list = this.getListItems(this.groupData)
    for (const item of list) {
      const dateMoment = DateTime.fromISO(item.recordedAt)
      const createdDateMoment = DateTime.fromISO(item.createdAt)

      const itemElement = document.createElement('div')
      itemElement.className = 'list-detail-item'

      itemElement.innerHTML = `
        <div class='item-content'>
          <p class='item-time'>${dateMoment.toFormat('hh:mm a')}</p>
          <p class='item-value'>${item.value} ${item.unit}</p>
          <p class='item-created-at'>${translate(
            'CREATED_AT'
          )} ${createdDateMoment.toFormat('LLL dd, yyyy, hh:mm a')}</p>
          <p class='item-source'>${item.source}</p>
        </div>
      `

      const deleteIcon = document.createElement('img')
      deleteIcon.className = 'delete-btn'
      deleteIcon.src = 'assets/img/trash.svg'

      deleteIcon.addEventListener('click', () => this.onDeleteDataPoint(item))

      itemElement.appendChild(deleteIcon)

      document.getElementById('list-detail-items').appendChild(itemElement)
    }
  }

  private onOpenDetails(item: ListItem): void {
    this.listItem = item
    document.getElementById('list-details').className = 'open'
    document.getElementById('list-detail-title').innerText = `${
      item.name
    } ${translate('DETAILS')}`
    document.getElementById('list-detail-items').innerText = ''

    const dateMoment = DateTime.fromISO(item.recordedAt)

    document.getElementById('list-detail-date').innerText =
      dateMoment.toFormat('LLL dd, yyyy')

    void this.fetchMeasurementData()
  }

  private loading(showLoading: boolean) {
    document.getElementById('loading-wrapper').style.display = showLoading
      ? 'flex'
      : 'none'
  }

  private error(msg: string) {
    document.getElementById('error').innerText = msg
    document.getElementById('error').style.display = 'block'
  }

  private async onDeleteDataPoint(item: ListItem) {
    this.loading(true)

    try {
      await api.measurementDataPoint.delete({ id: item.id })
      document.getElementById('list-detail-items').innerText = ''
      await this.fetchMeasurementData()
    } catch (err) {
      this.error(err)
    } finally {
      this.loading(false)
    }
  }

  private async fetchMeasurementData() {
    this.groupData = []
    const start = DateTime.fromISO(this.listItem.recordedAt)
      .startOf('day')
      .toISO()
    const end = DateTime.fromISO(this.listItem.recordedAt).endOf('day').toISO()
    this.loading(true)

    try {
      const res = await api.measurementDataPoint.getGroups({
        account: api.baseData.accountId || undefined,
        type: api.baseData.dataPointTypes.map((t) => t.id),
        recordedAt: {
          start,
          end
        }
      })

      this.groupData = res.data
      this.renderItems()
    } catch (err) {
      this.error(err)
    } finally {
      this.loading(false)
    }
  }

  private getListItems(entries: MeasurementDataPointGroup[]): ListItem[] {
    if (
      api.baseData.dataPointTypeId === DataPointTypes.BLOOD_PRESSURE_GENERAL
    ) {
      return this.getListAsBloodPressure(entries)
    }

    if (api.baseData.isWeightRequired) {
      return this.getListAsWeightRequired(entries)
    }

    return this.getListAsGeneric(entries)
  }

  private getListAsBloodPressure(
    entries: MeasurementDataPointGroup[]
  ): ListItem[] {
    return entries
      .filter((group) => !!group.dataPoints[0])
      .map((group) => {
        const dataPoint = group.dataPoints[0]
        const unit = utils.unit(dataPoint.type, api.baseData.metric)
        const value = group.dataPoints
          .map((t) =>
            utils.format(
              convertToReadableFormat(t.value, t.type, api.baseData.metric),
              api.baseData.dataPointTypeId
            )
          )
          .join('/')

        return {
          id: dataPoint.id,
          groupId: group.id,
          name: translate('BLOOD_PRESSURE'),
          value,
          unit,
          source: group.source.name,
          timestamp: group.recordedAt.utc,
          createdAt: group.createdAt.utc,
          recordedAt: group.recordedAt.utc
        }
      })
  }

  private getListAsGeneric(entries: MeasurementDataPointGroup[]): ListItem[] {
    return entries
      .filter(
        (group) =>
          !!group.dataPoints.find(
            (entry) => entry.type.id === api.baseData.dataPointTypeId
          )
      )
      .map((group) => {
        const dataPoint = group.dataPoints.find(
          (entry) => entry.type.id === api.baseData.dataPointTypeId
        )
        const unit = utils.unit(dataPoint.type, api.baseData.metric)

        const value = utils.format(
          convertToReadableFormat(
            dataPoint.value,
            dataPoint.type,
            api.baseData.metric
          ),
          api.baseData.dataPointTypeId
        )

        return {
          id: dataPoint.id,
          groupId: group.id,
          name: dataPoint.type.name,
          value,
          unit,
          source: group.source.name,
          timestamp: group.recordedAt.utc,
          createdAt: group.createdAt.utc,
          recordedAt: group.recordedAt.utc
        }
      })
  }

  private getListAsWeightRequired(
    entries: MeasurementDataPointGroup[]
  ): ListItem[] {
    return entries
      .filter(
        (group) =>
          !!group.dataPoints.find(
            (entry) => entry.type.id === DataPointTypes.WEIGHT
          ) &&
          !!group.dataPoints.find(
            (entry) => entry.type.id === api.baseData.dataPointTypeId
          )
      )
      .map((group) => {
        const weightDataPoint = group.dataPoints.find(
          (entry) => entry.type.id === DataPointTypes.WEIGHT
        )
        const dataPoint = group.dataPoints.find(
          (entry) => entry.type.id === api.baseData.dataPointTypeId
        )

        const weightUnit = utils.unit(weightDataPoint.type, api.baseData.metric)
        const unit = utils.unit(dataPoint.type, api.baseData.metric)

        const value = utils.format(
          convertToReadableFormat(
            dataPoint.value,
            dataPoint.type,
            api.baseData.metric
          ),
          api.baseData.dataPointTypeId
        )

        const weightInitialValue =
          ((weightDataPoint.value || 0) * Number(value)) / 100

        const weightValue = utils.format(
          convertToReadableFormat(
            weightInitialValue,
            weightDataPoint.type,
            api.baseData.metric
          ),
          DataPointTypes.WEIGHT
        )

        return {
          id: dataPoint.id,
          groupId: group.id,
          name: dataPoint.type.name,
          value: `${weightValue} ${weightUnit}`,
          unit: `(${value} ${unit})`,
          source: group.source.name,
          timestamp: group.recordedAt.utc,
          createdAt: group.createdAt.utc,
          recordedAt: group.recordedAt.utc
        }
      })
  }
}

customElements.define('dashboard-list-details', ListDetailsElement)
