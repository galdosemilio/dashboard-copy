import { CcrElement, Tab } from '@chart/model'
import { api } from '@chart/service/api'
import { tabService, eventService } from '@chart/service'
import { translate } from '@chart/service/i18n'
import {
  MeasurementDataPointAggregate,
  convertToReadableFormat,
  DataPointTypes
} from '@coachcare/sdk'
import { DateTime } from 'luxon'

import { ListItem } from '@chart/model'
import { groupBy, orderBy, uniqBy } from 'lodash'
import * as utils from '@chart/utils'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

export class ListElement extends CcrElement {
  private _loading: boolean
  private hasMore = true
  private firstTime = true
  private offset: number
  private limit: number | 'all'
  private data: MeasurementDataPointAggregate[]
  private listStartPosition = { x: 0, y: 0 }
  private listCurrentPosition = { x: 0, y: 0 }
  private onScrollList$: Subject<void> = new Subject<void>()

  constructor() {
    super()
    this.onScrollList = this.onScrollList.bind(this)
  }

  render() {
    this.innerHTML = `
      <div id='pull-up-refresh'>
        <div id="refreshing-wrapper">
          <div class="loading-bar"><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
      <div id='list-content'></div>
      <dashboard-list-details></dashboard-list-details>`
  }

  afterViewInit() {
    document
      .getElementById('list-wrapper')
      .addEventListener('scroll', () => this.onScrollList$.next())

    this.subscriptions.push(
      this.onScrollList$.pipe(debounceTime(300)).subscribe(this.onScrollList)
    )

    this.pullToRefreshList(document.getElementById('list-wrapper'))

    this.subscriptions.push(
      tabService.selectedTab$.subscribe((tab) => {
        if (tab === Tab.LIST && api.baseData.token) {
          this.refresh()
        }
      })
    )

    eventService
      .listen('list.details-deleted')
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.refresh()
      })
  }

  private pullToRefreshList(element: HTMLElement): void {
    this.listStartPosition = { x: 0, y: 0 }
    this.listCurrentPosition = { x: 0, y: 0 }

    element.addEventListener('touchstart', (e) => this.swipeStartList(e), false)
    element.addEventListener(
      'touchmove',
      (e) => this.swipeMoveList(element, e),
      false
    )
    element.addEventListener(
      'touchend',
      (e) => this.swipeEndList(element, e),
      false
    )
  }

  private swipeStartList(event: TouchEvent): void {
    const touch = event.targetTouches[0]
    this.listStartPosition.x = touch.screenX
    this.listStartPosition.y = touch.screenY
  }

  private swipeEndList(element: HTMLElement, event: TouchEvent): void {
    if (element.scrollTop !== 0) {
      return
    }

    const touch = event.changedTouches[0]
    this.listCurrentPosition.x = touch.screenX
    this.listCurrentPosition.y = touch.screenY

    const changeY =
      this.listStartPosition.y < this.listCurrentPosition.y
        ? Math.abs(this.listStartPosition.y - this.listCurrentPosition.y)
        : 0

    document.getElementById('pull-up-refresh').style.transition =
      'height 0.22s ease-in-out'
    document.getElementById('pull-up-refresh').style.height = '0px'

    if (changeY >= 100) {
      this.refresh()
    }
  }

  private swipeMoveList(element: HTMLElement, event: TouchEvent): void {
    if (element.scrollTop !== 0) {
      return
    }

    const touch = event.changedTouches[0]
    this.listCurrentPosition.x = touch.screenX
    this.listCurrentPosition.y = touch.screenY

    const changeY =
      this.listStartPosition.y < this.listCurrentPosition.y
        ? Math.abs(this.listStartPosition.y - this.listCurrentPosition.y)
        : 0

    if (changeY > 2) {
      event.stopPropagation()
      event.preventDefault()
    }

    document.getElementById('pull-up-refresh').style.transition = 'none'
    document.getElementById('pull-up-refresh').style.height = `${changeY}px`
  }

  onScrollList() {
    const content = document.getElementById('list-content')
    const wrapper = document.getElementById('list-wrapper')

    if (
      wrapper.scrollTop + wrapper.offsetHeight >= content.offsetHeight - 60 &&
      !this._loading
    ) {
      void this.loadList()
    }
  }

  private addItemToListView(entries: MeasurementDataPointAggregate[]) {
    const data = this.getListItems(entries)
    const list = orderBy(data, ['recordedAt'], ['desc'])

    if (list.length === 0 && this.firstTime) {
      this.showEmptyListError()
      return
    }

    for (const item of list) {
      const dateMoment = DateTime.fromISO(item.recordedAt)
      const element = document.createElement('div')
      element.className = 'list-item'

      const itemElement = document.createElement('div')
      itemElement.className = 'item'

      itemElement.innerHTML = `
        <div class='item-wrap'>
          <div class='content-left'>
            <p class='month'>${dateMoment.toFormat('MMM')}</p>
            <p class='day'>${dateMoment.toFormat('dd')}</p>
          </div>
          <div class='comma'></div>
          <div class='content-right'>
            <p class='time'>${dateMoment.toFormat('hh:mm a')} ${
        item.count > 1 ? `& ${item.count - 1} more` : ''
      }</p>
            <p class='value'>${item.value} ${item.unit}</p>
          </div>
          <div class="arrow-right">
            <img src='assets/img/arrow-right.svg' />
          </div>
        </div>
      `

      const actionElement = document.createElement('div')
      actionElement.className = 'action'

      element.appendChild(itemElement)
      element.appendChild(actionElement)

      document.getElementById('list-content').appendChild(element)

      itemElement.addEventListener('click', () =>
        eventService.trigger('list.details', item)
      )
    }
  }

  private error(msg: string) {
    document.getElementById('error').innerText = msg
    document.getElementById('error').style.display = 'block'
  }

  private refresh() {
    this.hasMore = true
    this.offset = 0
    this.data = []
    this.firstTime = true
    document.getElementById('list-content').innerText = ''
    eventService.trigger('list.no-previous-entries', false)
    eventService.trigger('list.refresh')
    void this.loadList()
  }

  private async loadList() {
    if (!this.hasMore) {
      return
    }

    this.loading(true)

    try {
      const res = await api.measurementDataPoint.getAggregates({
        account: api.baseData.accountId || undefined,
        unit: 'day',
        type: api.baseData.dataPointTypes.map((t) => t.id),
        limit: this.limit,
        offset: this.offset
      })

      this.offset = res.pagination.next
      this.hasMore = !!res.pagination.next
      this.data = uniqBy(this.data.concat(res.data), (entry) => entry.point.id)
      eventService.trigger<MeasurementDataPointAggregate>(
        'list.most-recent-entry',
        this.getMostRecentFromDate(
          DateTime.fromFormat(api.baseData.lastDate, 'yyyy-MM-dd')
        )
      )
      this.addItemToListView(res.data)
      this.firstTime = false
    } catch (err) {
      this.error(err)
    }

    this.loading(false)
  }

  private getListItems(entries: MeasurementDataPointAggregate[]): ListItem[] {
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
    entries: MeasurementDataPointAggregate[]
  ): ListItem[] {
    const list: ListItem[] = []

    const groupedValues = groupBy(entries, (item) => item.point.group.id)

    for (const [groupId, dataPoints] of Object.entries(groupedValues)) {
      const dataPoint = dataPoints[0]

      if (!dataPoint) {
        continue
      }

      const unit = utils.unit(dataPoint.point.type, api.baseData.metric)
      const value = dataPoints
        .sort((entry) =>
          entry.point.type.id === DataPointTypes.BLOOD_PRESSURE_SYSTOLIC
            ? -1
            : 1
        )
        .map((t) =>
          utils.format(
            convertToReadableFormat(
              t.point.value,
              t.point.type,
              api.baseData.metric
            ),
            api.baseData.dataPointTypeId
          )
        )
        .join('/')

      list.push({
        id: dataPoint.point.id,
        groupId,
        name: translate('BLOOD_PRESSURE'),
        value,
        unit,
        source: dataPoint.point.group.source.name,
        timestamp: dataPoint.bucket.timestamp,
        createdAt: dataPoint.point.group.createdAt.utc,
        recordedAt: dataPoint.point.group.recordedAt.utc,
        count: dataPoint.count
      })
    }

    return list
  }

  private getListAsGeneric(
    entries: MeasurementDataPointAggregate[]
  ): ListItem[] {
    const list: ListItem[] = []

    for (const dataPoint of entries) {
      const unit = utils.unit(dataPoint.point.type, api.baseData.metric)

      const value = utils.format(
        convertToReadableFormat(
          dataPoint.point.value,
          dataPoint.point.type,
          api.baseData.metric
        ),
        api.baseData.dataPointTypeId
      )

      list.push({
        id: dataPoint.point.id,
        groupId: dataPoint.point.group.id,
        name: dataPoint.point.type.name,
        value,
        unit,
        source: dataPoint.point.group.source.name,
        timestamp: dataPoint.bucket.timestamp,
        createdAt: dataPoint.point.createdAt.utc,
        recordedAt: dataPoint.point.group.recordedAt.utc,
        count: dataPoint.count
      })
    }

    return list
  }

  private getListAsWeightRequired(
    entries: MeasurementDataPointAggregate[]
  ): ListItem[] {
    const list: ListItem[] = []

    const weightDataPoints = entries.filter(
      (item) => item.point.type.id === DataPointTypes.WEIGHT
    )
    const dataPoints = entries.filter(
      (item) => item.point.type.id !== DataPointTypes.WEIGHT
    )

    for (const dataPoint of dataPoints) {
      const unit = utils.unit(dataPoint.point.type, api.baseData.metric)

      const weightDataPointType = api.baseData.dataPointTypes.find(
        (d) => d.id === DataPointTypes.WEIGHT
      )
      const weightDataPoint = weightDataPoints.find(
        (item) => item.bucket.date === dataPoint.bucket.date
      )
      const weightUnit = utils.unit(weightDataPointType, api.baseData.metric)

      const value = utils.format(
        convertToReadableFormat(
          dataPoint.point.value,
          dataPoint.point.type,
          api.baseData.metric
        ),
        api.baseData.dataPointTypeId
      )

      const weightInitialValue =
        ((weightDataPoint?.point.value || 0) * Number(value)) / 100

      const weightValue = utils.format(
        convertToReadableFormat(
          weightInitialValue,
          weightDataPointType,
          api.baseData.metric
        ),
        DataPointTypes.WEIGHT
      )

      list.push({
        id: dataPoint.point.id,
        groupId: dataPoint.point.group.id,
        name: dataPoint.point.type.name,
        value: `${weightValue} ${weightUnit}`,
        unit: `(${value} ${unit})`,
        source: dataPoint.point.group.source.name,
        timestamp: dataPoint.bucket.timestamp,
        createdAt: dataPoint.point.createdAt.utc,
        recordedAt: dataPoint.point.group.recordedAt.utc,
        count: dataPoint.count
      })
    }

    return list
  }

  private getMostRecentFromDate(date: DateTime): MeasurementDataPointAggregate {
    return this.data.find(
      (entry) => DateTime.fromISO(entry.bucket.timestamp) <= date
    )
  }

  private loading(showLoading: boolean) {
    this._loading = showLoading
    document.getElementById('loading-wrapper').style.display = showLoading
      ? 'flex'
      : 'none'
  }

  private showEmptyListError(): void {
    const dataPointName =
      api.baseData.dataPointTypeId === DataPointTypes.BLOOD_PRESSURE_GENERAL
        ? translate('BLOOD_PRESSURE')
        : api.baseData.dataPointTypes[0].name

    const element = document.createElement('div')
    element.className = 'list-no-item'
    element.innerText = `${translate('NO_RECORD')} ${dataPointName}`

    document.getElementById('list-content').appendChild(element)
    eventService.trigger('list.no-previous-entries', true)
  }
}

customElements.define('dashboard-list', ListElement)
