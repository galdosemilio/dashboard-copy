import { CcrElement } from '@chart/model'
import { eventService } from '@chart/service'
import { translate } from '@chart/service/i18n'
import { NamedEntity } from '@coachcare/sdk'

import './source-selector.element.scss'

export class SourceSelectorElement extends CcrElement {
  private sourceId = '-1'

  constructor() {
    super()
  }

  afterViewInit(): void {
    eventService.listen<NamedEntity[]>('graph.sources').subscribe((sources) => {
      this.renderSourceSelector(sources)
    })

    eventService.baseDataEvent$.subscribe((baseData) => {
      if (baseData.sourceId) {
        this.sourceId = baseData.sourceId
      }
    })
  }
  render() {
    this.afterViewInit()
  }

  private renderSourceSelector(sources: NamedEntity[]) {
    if (sources.length <= 1) {
      this.innerHTML = ''
    }

    let options = `<option value="-1">${translate(
      'HIGHEST_VALUE_FOR_DAY'
    )}</option>`

    sources.forEach((source) => {
      options += `<option value="${source.id}" ${
        source.id === this.sourceId ? 'selected' : ''
      }>${source.name}</option>`
    })

    const selectElement = `
      <select name="" id="source-selector">
        ${options}
      </select>
    `

    this.innerHTML = `
      <div class="source-select-container">
        <label>${translate('DATA_SOURCE')}: </label>
        <div class="select-wrap">
          ${selectElement}
        </div>
      </div>
    `

    document.getElementById('source-selector').onchange = () => {
      const value = (<HTMLInputElement>(
        document.getElementById('source-selector')
      )).value

      this.sourceId = value
      eventService.trigger('graph.source-change', value)
    }
  }
}

customElements.define('dashboard-source-selector', SourceSelectorElement)
