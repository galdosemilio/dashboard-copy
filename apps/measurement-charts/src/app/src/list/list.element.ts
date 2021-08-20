import { CcrElement, MeasurementsEnum, Tab } from '@chart/model'
import { api } from '@chart/service/api'
import { tabService, modalService, eventService } from '@chart/service'
import { translate } from '@chart/service/i18n'
import {
  MeasurementDataPointAggregate,
  convertToReadableFormat
} from '@coachcare/sdk'
import { DateTime } from 'luxon'

import './list.element.scss'
import { DataPointChangedEvent, EventType, ListItem } from '@chart/model'
import { groupBy, uniqBy } from 'lodash'
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
      <div id='list-content'></div>`
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

  async onDeleteDataPoint(item: ListItem) {
    try {
      this.loading(true)

      await api.measurementDataPoint.deleteGroup({ id: item.groupId })

      const deletedData = this.data.filter(
        (t) => t.point.group.id === item.groupId
      )
      this.data = this.data.filter((t) => t.point.group.id !== item.groupId)

      if (typeof this.offset === 'number' && this.offset > 0) {
        this.offset -= 1
      }

      document.getElementById('list-content').innerText = ''
      this.addItemToListView(this.data)

      if (deletedData.length > 0) {
        const event: DataPointChangedEvent = {
          type: EventType.DATA_POINT_CHANGED,
          data: deletedData[0]
        }

        window.ReactNativeWebView?.postMessage(JSON.stringify(event))
      }

      modalService.close$.next()
    } catch (err) {
      this.error(err)
    } finally {
      this.loading(false)
    }
  }

  onScrollList() {
    const content = document.getElementById('list-content')
    const wrapper = document.getElementById('list-wrapper')

    if (
      wrapper.scrollTop + wrapper.offsetHeight >= content.offsetHeight - 60 &&
      !this._loading
    ) {
      this.loadList()
    }
  }

  private addItemToListView(entries: MeasurementDataPointAggregate[]) {
    const list = this.getListItems(entries)

    if (list.length === 0 && this.firstTime) {
      this.showEmptyListError()
      return
    }

    for (const item of list) {
      const dateMoment = DateTime.fromISO(item.timestamp)
      const element = document.createElement('div')
      element.className = 'list-item'

      const itemElement = document.createElement('div')
      itemElement.className = 'item'

      itemElement.innerHTML = `
        <div class='content'>
          <p class='value'>${item.name}: ${item.value}
            ${item.unit}
          </p>
          <p>${dateMoment.toFormat('EEE, MMM d, yyyy')}</p>
        </div>
        <p class="arrow-right">▶</p>
      `

      const actionElement = document.createElement('div')
      actionElement.className = 'action'

      element.appendChild(itemElement)
      element.appendChild(actionElement)

      document.getElementById('list-content').appendChild(element)

      itemElement.addEventListener('click', () => this.openDetails(item))
    }
  }

  private openDetails(item: ListItem) {
    modalService.open$.next({
      title: translate('DETAILS'),
      full: true,
      content: `
        <div class="detail-view">
          <div class="detail-item">
            <p class="detail-title">${item.name}</p>
            <p class="detail-content">
              ${item.value}
              ${item.unit}
            </p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('DATE')}</p>
            <p class="detail-content">${DateTime.fromISO(
              item.timestamp
            ).toLocaleString(DateTime.DATE_MED)}</p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('CREATED_AT')}</p>
            <p class="detail-content">${DateTime.fromISO(
              item.createdAt
            ).toLocaleString(DateTime.DATETIME_MED)}</p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('SOURCE')}</p>
            <p class="detail-content">${item.source}</p>
          </div>
          <div class="action">
            <div id="delete-item" class="delete-btn">${translate(
              'DELETE'
            )}</div>
          </div>
        </div>
      `
    })

    document
      .getElementById('delete-item')
      .addEventListener('click', () => this.onDeleteDataPoint(item))
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
    this.loadList()
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
      this.addItemToListView(res.data)
      this.firstTime = false
    } catch (err) {
      this.error(err)
    }

    this.loading(false)
  }

  private getListItems(entries: MeasurementDataPointAggregate[]): ListItem[] {
    const list: ListItem[] = []

    if (
      api.baseData.dataPointTypeId === MeasurementsEnum.BLOOD_PRESSURE_GENERAL
    ) {
      const groupedValues = groupBy(entries, (item) => item.point.group.id)

      for (const [groupId, dataPoints] of Object.entries(groupedValues)) {
        const dataPoint = dataPoints[0]

        if (!dataPoint) {
          continue
        }

        const unit = utils.unit(dataPoint.point.type, api.baseData.metric)
        const value = dataPoints
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
          groupId,
          name: translate('BLOOD_PRESSURE'),
          value,
          unit,
          source: dataPoint.point.group.source.name,
          timestamp: dataPoint.bucket.timestamp,
          createdAt: dataPoint.point.group.createdAt.utc
        })
      }
    } else {
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
          groupId: dataPoint.point.group.id,
          name: dataPoint.point.type.name,
          value,
          unit,
          source: dataPoint.point.group.source.name,
          timestamp: dataPoint.bucket.timestamp,
          createdAt: dataPoint.point.createdAt.utc
        })
      }
    }

    return list
  }

  private loading(showLoading: boolean) {
    this._loading = showLoading
    document.getElementById('loading-wrapper').style.display = showLoading
      ? 'flex'
      : 'none'
  }

  private showEmptyListError(): void {
    const dataPointName =
      api.baseData.dataPointTypeId === MeasurementsEnum.BLOOD_PRESSURE_GENERAL
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
