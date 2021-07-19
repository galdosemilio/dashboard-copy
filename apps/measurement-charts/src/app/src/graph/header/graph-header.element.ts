import { CcrElement } from '@chart/model'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
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
      .listen<GraphEntry[][]>('graph.data')
      .subscribe((data: GraphEntry[][]) => this.setHeader(data))
  }

  private setHeader(data: GraphEntry[][]) {
    let headers = ''
    const showUnitToLast =
      new Set(api.baseData.dataPointTypes.map((t) => api.unit(t))).size === 1

    data.forEach((entries, index) => {
      const filteredData = entries.filter((entry) => entry.value !== undefined)
      const values = filteredData.map((entry) => entry.value)

      const min = (filteredData.length ? Math.min(...values) : 0).toFixed(2)

      const max = (filteredData.length ? Math.max(...values) : 0).toFixed(2)

      let average = filteredData.length
        ? Math.round(
            values.reduce((value, entry) => (value += entry), 0) /
              Math.max(values.length, 1)
          )
        : 0

      let unit = api.unit(api.baseData.dataPointTypes[index])

      if (unit) {
        average = Number(average.toFixed(2))
      }

      if (showUnitToLast && index < data.length - 1) {
        unit = ''
      }

      const range = `${min} - ${max}<span class="unit">${unit}</span>`
      const header = `<div class="header-wrap">
        <p class="value">${average}<span class="unit">${unit}</span></p>
        <p class="range">${range}</p>
      </div>`

      headers += header
    })

    document.getElementById('graph-header').innerHTML = headers
  }
}

customElements.define('dashboard-graph-header', GraphHeaderElement)
