import { CcrElement, DateRange, Timeframe } from '@chart/model'
import { eventService } from '@chart/service'
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
    document
      .querySelector('#timeframe-left')
      .addEventListener('click', this.onClickLeft)
    document
      .querySelector('#timeframe-right')
      .addEventListener('click', this.onClickRight)
  }

  onDestroy(): void {
    document
      .querySelector('#timeframe-left')
      .removeEventListener('click', this.onClickLeft)
    document
      .querySelector('#timeframe-right')
      .removeEventListener('click', this.onClickRight)
  }

  onInit(): void {
    this.listenToEvents()
  }

  render() {
    this.innerHTML = `
      <div class="date-range-container">
        <span id="timeframe-left">◀</span>
        <p>
          ${this.renderDateRange()}
        </p>
        <span id="timeframe-right">▶</span>
      </div>
    `

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
    const today = DateTime.now()

    this.dateRange = {
      start: today.startOf(timeframe).toISO(),
      end: today.endOf(timeframe).toISO()
    }

    eventService.trigger('graph.date-range', this.dateRange)
  }

  private refreshTimeframe(timeframe: Timeframe): void {
    this.timeframe = timeframe ?? Timeframe.WEEK
    this.refreshDateRange(this.timeframe)
    this.render()
  }

  private renderDateRange(): string {
    const start = DateTime.fromISO(this.dateRange.start)
    const end = DateTime.fromISO(this.dateRange.end)
    const format =
      this.timeframe === Timeframe.WEEK ? 'EEE, MMM d, yyyy' : 'MMM yyyy'

    switch (this.timeframe) {
      case Timeframe.WEEK:
      case Timeframe.YEAR:
        return `
        <span>${start.toFormat(format)}</span>
        <span>-</span>
        <span>${end.toFormat(format)}</span>
        `

      case Timeframe.MONTH:
        return `<span>${start.toFormat(format)}</span>`
    }
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
