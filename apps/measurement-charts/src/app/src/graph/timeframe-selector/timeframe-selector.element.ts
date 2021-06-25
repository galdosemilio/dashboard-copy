import { CcrElement, Timeframe } from '@chart/model'
import { eventService } from '@chart/service'
import { translate } from '@chart/service/i18n'

import './timeframe-selector.element.scss'

export class TimeframeSelectorElement extends CcrElement {
  private selectorItems: HTMLDivElement[] = []

  constructor() {
    super()
    this.onItemClick = this.onItemClick.bind(this)
  }

  render(): void {
    this.innerHTML = `
      <div class="timeframe-selector-container">
        <div class="timeframe-selector-item" data-timeframe="week">${translate(
          'WEEK'
        )}</div>
        <div class="timeframe-selector-item-separator">|</div>
        <div class="timeframe-selector-item" data-timeframe="month">${translate(
          'MONTH'
        )}</div>
        <div class="timeframe-selector-item-separator">|</div>
        <div class="timeframe-selector-item" data-timeframe="year">${translate(
          'YEAR'
        )}</div>
      </div>
    `
  }

  afterViewInit(): void {
    this.listenToEvents()

    this.subscriptions.push(
      eventService.baseDataEvent$.subscribe((data) =>
        this.onChangeTimeFrame(data.timeframe)
      )
    )
  }

  private onChangeTimeFrame(timeframe: Timeframe): void {
    const foundOption = this.selectorItems.find(
      (item) => timeframe === item.dataset.timeframe
    )

    if (!foundOption) {
      return
    }

    eventService.trigger('graph.timeframe', foundOption.dataset.timeframe)
    this.onItemClick({ target: foundOption })
  }

  private deactivateSelectorItems(): void {
    this.selectorItems.forEach((item) => item.classList.remove('active'))
  }

  private listenToEvents(): void {
    const selectorItems = document
      .querySelector('dashboard-graph-timeframe-selector')
      .querySelectorAll('.timeframe-selector-item')

    selectorItems.forEach((item) =>
      item.addEventListener('click', this.onItemClick)
    )

    this.selectorItems = Array.from(selectorItems) as HTMLDivElement[]
  }

  private onItemClick($event: { target: EventTarget }): void {
    const div = $event.target as HTMLDivElement
    this.deactivateSelectorItems()

    div.classList.add('active')

    eventService.trigger('graph.timeframe', div.dataset.timeframe)
  }
}

customElements.define(
  'dashboard-graph-timeframe-selector',
  TimeframeSelectorElement
)
