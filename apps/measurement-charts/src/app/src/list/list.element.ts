import { baseData, CcrElement, Tab } from '@chart/model'
import { api } from '@chart/service/api'
import { tabService, modalService } from '@chart/service'
import { translate } from '@chart/service/i18n'
import {
  MeasurementDataPointAggregate,
  convertToReadableFormat,
  convertUnitToPreferenceFormat
} from '@coachcare/sdk'
import { DateTime } from 'luxon'

import './list.element.scss'

export class ListElement extends CcrElement {
  private _loading: boolean
  private hasMore = true
  private offset: number
  private limit: number | 'all'
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
        this.generateList()
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

  async onDeleteDataPoint(id: string) {
    await api.measurementDataPoint.delete({ id })
    modalService.close$.next()
  }

  onScrollList() {
    const wrapper = document.getElementById('list-wrapper')
    const content = document.getElementById('list-content')

    if (
      wrapper.scrollTop + wrapper.offsetHeight >= content.offsetHeight - 20 &&
      !this._loading
    ) {
      this.generateList()
    }
  }

  private addItemToListView(data: MeasurementDataPointAggregate[]) {
    for (const item of data) {
      const dateMoment = DateTime.fromISO(item.bucket.timestamp)
      const element = document.createElement('div')
      element.className = 'list-item'

      const itemElement = document.createElement('div')
      itemElement.className = 'item'

      itemElement.innerHTML = `
        <div class='date-wrap'>
          <p class='date-month'>
            ${dateMoment.toFormat('MMM')}
          </p>
          <p class='date-day' style="color: ${baseData.colors.primary}">
            ${dateMoment.toFormat('d')}
          </p>
        </div>
        <div class='content'>
          <p class='value'>${item.point.type.name}: ${convertToReadableFormat(
        item.point.value,
        item.point.type,
        baseData.metric
      ).toFixed(2)}
            ${convertUnitToPreferenceFormat(item.point.type, baseData.metric)}
          </p>
          <p>${dateMoment.toFormat('h:mm a')}</p>
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
        this.onDeleteDataPoint(item.point.id)
      )

      itemElement.addEventListener('click', () => this.openDetails(item))
    }
  }

  private openDetails(item: MeasurementDataPointAggregate) {
    modalService.open$.next({
      title: translate('DETAILS'),
      content: `
        <div class="detail-view">
          <div class="detail-item">
            <p class="detail-title">${item.point.type.name}</p>
            <p class="detail-content">
              ${convertToReadableFormat(
                item.point.value,
                item.point.type,
                baseData.metric
              ).toFixed(2)}
              ${convertUnitToPreferenceFormat(item.point.type, baseData.metric)}
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
      .addEventListener('click', () => this.onDeleteDataPoint(item.point.id))
  }

  private error(msg: string) {
    document.getElementById('error').innerText = msg
    document.getElementById('error').style.display = 'block'
  }

  private refresh() {
    this.hasMore = true
    this.offset = 0
    document.getElementById('list-content').innerText = ''
    this.generateList()
  }

  private async generateList() {
    if (!this.hasMore) {
      return
    }

    this.loading(true)

    try {
      const res = await api.measurementDataPoint.getAggregates({
        account: api.baseData.accountId,
        recordedAt: {
          start: new Date('2020-01-01').toISOString(),
          end: new Date().toISOString()
        },
        unit: 'day',
        type: [api.baseData.dataPointTypeId],
        limit: this.limit,
        offset: this.offset
      })

      this.offset = res.pagination.next
      this.hasMore = !!res.pagination.next
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
