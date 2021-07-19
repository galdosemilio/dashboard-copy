import { CcrElement, Tab } from '@chart/model'
import { api } from '@chart/service/api'
import { tabService, modalService } from '@chart/service'
import { translate } from '@chart/service/i18n'
import {
  MeasurementDataPointAggregate,
  convertToReadableFormat
} from '@coachcare/sdk'
import { DateTime } from 'luxon'

import './list.element.scss'
import { DataPointChangedEvent, EventType } from '@chart/model/event'

export class ListElement extends CcrElement {
  private _loading: boolean
  private hasMore = true
  private offset: number
  private limit: number | 'all'
  private data: MeasurementDataPointAggregate[]
  private listStartPosition = { x: 0, y: 0 }
  private listCurrentPosition = { x: 0, y: 0 }
  private itemDragStart = 0
  private itemDragEnd = 0
  private isStartedItemSwipe = false
  private isStartedListSwipe = false

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
      .addEventListener('scroll', this.onScrollList)

    this.pullToRefreshList(document.getElementById('list-wrapper'))

    tabService.selectedTab$.subscribe((tab) => {
      if (tab === Tab.LIST && api.baseData.token) {
        this.refresh()
      }
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
    this.isStartedListSwipe = false

    if (element.scrollTop !== 0 || this.isStartedItemSwipe) {
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
    if (element.scrollTop !== 0 || this.isStartedItemSwipe) {
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
      this.isStartedListSwipe = true
    }

    document.getElementById('pull-up-refresh').style.transition = 'none'
    document.getElementById('pull-up-refresh').style.height = `${changeY}px`
  }

  private swipeItem(element: HTMLElement, offset: number) {
    this.itemDragStart = 0
    this.itemDragEnd = 0

    element.addEventListener('touchstart', (e) => this.swipeStartItem(e))
    element.addEventListener('touchmove', (e) => this.swipeMoveItem(element, e))
    element.addEventListener('touchend', () =>
      this.swipeEndItem(element, offset)
    )
  }

  private swipeStartItem(event: TouchEvent): void {
    this.itemDragEnd = event.touches[0].clientX
  }

  private swipeMoveItem(element: HTMLElement, event: TouchEvent): void {
    if (this.isStartedListSwipe) {
      return
    }

    this.itemDragStart = this.itemDragEnd - event.touches[0].pageX
    this.itemDragEnd = event.touches[0].pageX

    if (Math.abs(this.itemDragStart) > 2) {
      this.isStartedItemSwipe = true
    }

    element.style.left = element.offsetLeft - this.itemDragStart + 'px'
  }

  private swipeEndItem(element: HTMLElement, offset): void {
    if (this.isRtl && element.offsetLeft - 5 >= offset) {
      element.style.left = offset + 'px'
    } else if (!this.isRtl && element.offsetLeft * -1 - 5 >= offset) {
      element.style.left = -offset + 'px'
    } else {
      element.style.left = 0 + 'px'
    }
    this.isStartedItemSwipe = false
  }

  async onDeleteDataPoint(item: MeasurementDataPointAggregate) {
    try {
      this.loading(true)

      await api.measurementDataPoint.deleteGroup({ id: item.point.group.id })

      this.data = this.data.filter((t) => t.point.id !== item.point.id)

      if (typeof this.offset === 'number' && this.offset > 0) {
        this.offset -= 1
      }

      document.getElementById('list-content').innerText = ''
      this.addItemToListView(this.data)

      const event: DataPointChangedEvent = {
        type: EventType.DATA_POINT_CHANGED,
        dataPointTypeId: api.baseData.dataPointTypeId
      }

      window.ReactNativeWebView?.postMessage(JSON.stringify(event))
      modalService.close$.next()
    } catch (err) {
      this.error(err)
    } finally {
      this.loading(false)
    }
  }

  onScrollList() {
    const content = document.getElementById('list-content')

    if (
      content.scrollTop + content.offsetHeight >= content.offsetHeight - 20 &&
      !this._loading
    ) {
      this.loadList()
    }
  }

  private addItemToListView(data: MeasurementDataPointAggregate[]) {
    for (const item of data) {
      const dateMoment = DateTime.fromISO(item.bucket.timestamp)
      const element = document.createElement('div')
      element.className = 'list-item'

      const itemElement = document.createElement('div')
      itemElement.className = 'item'

      const unit = api.unit(item.point.type)

      const value = convertToReadableFormat(
        item.point.value,
        item.point.type,
        api.baseData.metric
      ).toFixed(unit ? 2 : 0)

      itemElement.innerHTML = `
        <div class='content'>
          <p class='value'>${item.point.type.name}: ${value}
            ${unit}
          </p>
          <p>${dateMoment.toFormat('EEE, MMM d, yyyy')}</p>
        </div>
        <p class="arrow-right">▶</p>
      `

      const actionElement = document.createElement('div')
      actionElement.className = 'action'

      const deleteElement = document.createElement('div')
      deleteElement.className = 'btn-delete'
      deleteElement.innerText = translate('DELETE')

      actionElement.appendChild(deleteElement)

      element.appendChild(itemElement)
      element.appendChild(actionElement)

      document.getElementById('list-content').appendChild(element)

      this.swipeItem(itemElement, deleteElement.offsetWidth)

      deleteElement.addEventListener('click', () =>
        this.openDeleteConfirm(item)
      )

      itemElement.addEventListener('click', () => this.openDetails(item))
    }
  }

  private openDeleteConfirm(item: MeasurementDataPointAggregate) {
    modalService.open$.next({
      title: translate('CONFIRM'),
      content: `
        <div class="delete-confirm-modal">
          <div class="modal-content">
            <p>${translate('DELETE_CONFIRM')}</p>
          </div>
          <div class="actions">
            <div id="delete-button" class="delete-btn">${translate(
              'DELETE'
            )}</div>
            <div id="close-button" class="cancel-btn">${translate(
              'CANCEL'
            )}</div>
          </div>
        </div>
      `
    })

    document.getElementById('delete-button').addEventListener('click', () => {
      modalService.close$.next()
      this.onDeleteDataPoint(item)
    })
    document
      .getElementById('close-button')
      .addEventListener('click', () => modalService.close$.next())
  }

  private openDetails(item: MeasurementDataPointAggregate) {
    const unit = api.unit(item.point.type)
    modalService.open$.next({
      title: translate('DETAILS'),
      full: true,
      content: `
        <div class="detail-view">
          <div class="detail-item">
            <p class="detail-title">${item.point.type.name}</p>
            <p class="detail-content">
              ${convertToReadableFormat(
                item.point.value,
                item.point.type,
                api.baseData.metric
              ).toFixed(2)}
              ${unit}
            </p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('DATE')}</p>
            <p class="detail-content">${DateTime.fromISO(
              item.bucket.timestamp
            ).toLocaleString(DateTime.DATE_MED)}</p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('TIME')}</p>
            <p class="detail-content">${DateTime.fromISO(
              item.bucket.timestamp
            ).toLocaleString(DateTime.TIME_SIMPLE)}</p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('CREATED_AT')}</p>
            <p class="detail-content">${DateTime.fromISO(
              item.point.createdAt.utc
            ).toLocaleString(DateTime.DATETIME_MED)}</p>
          </div>
          <div class="detail-item">
            <p class="detail-title">${translate('SOURCE')}</p>
            <p class="detail-content">${item.point.group.source.name}</p>
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
    document.getElementById('list-content').innerText = ''
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
        recordedAt: {
          start: new Date('2020-01-01').toISOString(),
          end: new Date().toISOString()
        },
        unit: 'day',
        type: api.baseData.dataPointTypes.map((t) => t.id),
        limit: this.limit,
        offset: this.offset
      })

      this.offset = res.pagination.next
      this.hasMore = !!res.pagination.next
      this.data = this.data.concat(res.data)
      this.addItemToListView(res.data)
    } catch (err) {
      this.error(err)
    }

    this.loading(false)
  }

  private loading(showLoading: boolean) {
    this._loading = showLoading
    document.getElementById('loading-wrapper').style.display = showLoading
      ? 'flex'
      : 'none'
  }
}

customElements.define('dashboard-list', ListElement)
