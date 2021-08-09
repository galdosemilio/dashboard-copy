import { CcrElement, DateRange, Timeframe } from '@chart/model'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
import { DateTime } from 'luxon'

import './date-range-selector.element.scss'

export class DateRangeSelectorElement extends CcrElement {
  private dateRange: DateRange = { start: '', end: '' }
  private timeframe: Timeframe = Timeframe.WEEK

  constructor() {
    super()
    this.refreshTimeframe = this.refreshTimeframe.bind(this)
    this.onClickLeft = this.onClickLeft.bind(this)
    this.onClickRight = this.onClickRight.bind(this)
  }

  afterViewInit(): void {
    // we just commented bellow for switching timeframe by arrows. because we wanted to put it back easily when we need it.
    /* document
      .querySelector('#timeframe-left')
      .addEventListener('click', this.onClickLeft)
    document
      .querySelector('#timeframe-right')
      .addEventListener('click', this.onClickRight) */

    eventService
      .listen<DateRange>('graph.date-range-change')
      .subscribe((dateRange) => {
        this.dateRange = dateRange
        this.renderDateRange()
      })
  }

  onDestroy(): void {
    // we just commented bellow for switching timeframe by arrows. because we wanted to put it back easily when we need it.
    /* document
      .querySelector('#timeframe-left')
      .removeEventListener('click', this.onClickLeft)
    document
      .querySelector('#timeframe-right')
      .removeEventListener('click', this.onClickRight)
    */
  }

  onInit(): void {
    this.listenToEvents()
  }

  render() {
    this.renderDateRange()

    this.afterViewInit()
  }

  private listenToEvents(): void {
    this.subscriptions.push(
      eventService
        .listen<Timeframe>('graph.timeframe')
        .subscribe(this.refreshTimeframe),
      eventService.listen('graph.date-range-next').subscribe(this.onClickRight),
      eventService
        .listen('graph.date-range-previous')
        .subscribe(this.onClickLeft),
      eventService.baseDataEvent$.subscribe((data) =>
        this.refreshTimeframe(data.timeframe)
      )
    )
  }

  private onClickLeft(): void {
    this.updateDateRange(false)
  }

  private onClickRight(): void {
    this.updateDateRange(true)
  }

  private refreshDateRange(timeframe: Timeframe): void {
    const lastDate = api.baseData.lastDate
      ? DateTime.fromISO(api.baseData.lastDate)
      : DateTime.now()

    this.dateRange = {
      start: lastDate
        .minus({ [timeframe]: 1 })
        .plus({ day: 1 })
        .startOf('day')
        .toISO(),
      end: lastDate.endOf('day').toISO()
    }

    eventService.trigger('graph.date-range', this.dateRange)
  }

  private refreshTimeframe(timeframe: Timeframe): void {
    this.timeframe = timeframe ?? Timeframe.WEEK
    this.refreshDateRange(this.timeframe)
    this.render()
  }

  private renderDateRange(): void {
    const start = DateTime.fromISO(this.dateRange.start)
    const end = DateTime.fromISO(this.dateRange.end)
    const format =
      this.timeframe === Timeframe.WEEK ? 'EEE, MMM d, yyyy' : 'MMM d, yyyy'
    const dateRangeHtml = `
    <span>${start.toFormat(format)}</span>
    <span>-</span>
    <span>${end.toFormat(format)}</span>
    `

    this.innerHTML = `
      <div class="date-range-container">
        <span id="timeframe-left" style="display:none">◀</span>
        <p>
          ${dateRangeHtml}
        </p>
        <span id="timeframe-right" style="display:none">▶</span>
      </div>`
  }

  private updateDateRange(forward: boolean): void {
    this.dateRange = forward
      ? {
          start: DateTime.fromISO(this.dateRange.start)
            .plus({ [this.timeframe]: 1 })
            .toISO(),
          end: DateTime.fromISO(this.dateRange.end)
            .plus({ [this.timeframe]: 1 })
            .toISO()
        }
      : {
          start: DateTime.fromISO(this.dateRange.start)
            .minus({ [this.timeframe]: 1 })
            .toISO(),
          end: DateTime.fromISO(this.dateRange.end)
            .minus({ [this.timeframe]: 1 })
            .toISO()
        }

    eventService.trigger('graph.date-range', this.dateRange)
    this.render()
    this.afterViewInit()
  }
}

customElements.define('dashboard-date-range-selector', DateRangeSelectorElement)
