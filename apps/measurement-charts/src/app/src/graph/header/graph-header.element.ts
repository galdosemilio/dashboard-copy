import { CcrElement } from '@chart/model'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
import { convertUnitToPreferenceFormat } from '@coachcare/sdk'
import { GraphEntry } from '../graph.element'
import './graph-header.element.scss'
export class GraphHeaderElement extends CcrElement {
  render() {
    this.innerHTML = `
      <div>
        <dashboard-date-range-selector></dashboard-date-range-selector>
        <div id="graph-header"></div>
      </div>
    `
  }

  afterViewInit() {
    eventService
      .listen<GraphEntry[]>('graph.data')
      .subscribe((data: GraphEntry[]) => this.setHeader(data))
  }

  private setHeader(data: GraphEntry[]) {
    const filteredData = data.filter((entry) => entry.value !== undefined)
    const values = filteredData.map((entry) => entry.value)

    const min = (filteredData.length ? Math.min(...values) : 0).toFixed(2)

    const max = (filteredData.length ? Math.max(...values) : 0).toFixed(2)

    const average = (filteredData.length
      ? Math.round(
          values.reduce((value, entry) => (value += entry), 0) /
            Math.max(values.length, 1)
        )
      : 0
    ).toFixed(2)

    const unit = convertUnitToPreferenceFormat(
      api.baseData.dataPointType,
      api.baseData.metric
    )

    const range = `${min}<span class="unit">${unit}</span>- ${max}<span class="unit">${unit}</span>`

    document.getElementById('graph-header').innerHTML = `
      <div class="average-wrap">
        <p class="value">${average}<span class="unit">${unit}</span></p>
        <p class="range">${range}</p>
      </div>
    `
  }
}

customElements.define('dashboard-graph-header', GraphHeaderElement)
