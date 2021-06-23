import { CcrElement, DateRange, Timeframe } from '@chart/model'
import { eventService } from '@chart/service'
import { DateTime } from 'luxon'

import './date-range-selector.element.scss'

export class DateRangeSelectorElement extends CcrElement {
  private dateRange: DateRange = { start: '', end: '' }
  private subscriptions = []
  private timeframe: Timeframe = Timeframe.WEEK

  constructor() {
    super()
    this.refreshTimeframe = this.refreshTimeframe.bind(this)
  }

  onDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  onInit(): void {
    this.listenToEvents()
  }

  render() {
    this.innerHTML = `
      <div class="date-range-container">
        <p>
          ${this.renderDateRange()}
        </p>
      </div>
    `
  }

  private refreshDateRange(timeframe: Timeframe): void {
    const today = DateTime.now()

    this.dateRange = {
      start: today.startOf(timeframe).toISO(),
      end: today.endOf(timeframe).toISO()
    }

    eventService.trigger('graph.date-range', this.dateRange)
  }

  private listenToEvents(): void {
    this.subscriptions.push(
      eventService
        .listen<Timeframe>('graph.timeframe')
        .subscribe(this.refreshTimeframe),
      eventService.baseDataEvent$.subscribe((data) =>
        this.refreshTimeframe(data.timeframe)
      )
    )
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
}

customElements.define('dashboard-date-range-selector', DateRangeSelectorElement)
