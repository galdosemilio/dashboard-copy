import { CcrElement } from '@chart/model'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
import { GraphEntry } from '../graph.element'
import * as utils from '@chart/utils'
import './graph-header.element.scss'
import { DataPointTypes } from '@coachcare/sdk'
export class GraphHeaderElement extends CcrElement {
  render() {
    this.innerHTML = `
      <div>
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
      new Set(
        api.baseData.dataPointTypes.map((t) =>
          utils.unit(t, api.baseData.metric)
        )
      ).size === 1

    data.forEach((entries, index) => {
      const filteredData = entries.filter((entry) => entry.value !== undefined)
      const values = filteredData.map((entry) => entry.value)

      let min = utils.format(
        filteredData.length ? Math.min(...values) : 0,
        api.baseData.dataPointTypeId
      )

      let max = utils.format(
        filteredData.length ? Math.max(...values) : 0,
        api.baseData.dataPointTypeId
      )

      let average = utils.format(
        filteredData.length
          ? Math.round(
              values.reduce((value, entry) => (value += entry), 0) /
                Math.max(values.length, 1)
            )
          : 0,
        api.baseData.dataPointTypeId
      )

      let unit = utils.unit(
        api.baseData.dataPointTypes[index],
        api.baseData.metric
      )

      if (showUnitToLast && index < data.length - 1) {
        unit = ''
      }

      if (!api.baseData.isWeightRequired) {
        const range = `${min} - ${max}<span class="unit">${unit}</span>`
        const header = `<div class="header-wrap">
          <p class="value">${average}<span class="unit">${unit}</span></p>
          <p class="range">${range}</p>
        </div>`

        headers += header
        return
      }

      const weightDataPoint = api.baseData.dataPointTypes.find(
        (t) => t.id === DataPointTypes.WEIGHT
      )
      const baseUnit = unit
      unit = utils.unit(weightDataPoint, api.baseData.metric)

      const weightMin = utils.format(
        filteredData.length
          ? Math.min(...filteredData.map((f) => f.weightValue || 0))
          : 0,
        api.baseData.dataPointTypeId
      )

      const weightMax = utils.format(
        filteredData.length
          ? Math.max(...filteredData.map((f) => f.weightValue || 0))
          : 0,
        api.baseData.dataPointTypeId
      )

      const weightAverage = utils.format(
        filteredData.length
          ? Math.round(
              filteredData
                .map((f) => f.weightValue || 0)
                .reduce((value, entry) => (value += entry), 0) /
                Math.max(values.length, 1)
            )
          : 0,
        api.baseData.dataPointTypeId
      )

      min = `${utils.format(
        Number(weightMin) * (Number(min) / 100),
        api.baseData.dataPointTypeId
      )}<span class="unit">${unit}</span> <span class="sub-value">(${min}<span class="unit">${baseUnit}</span>)</span>`

      max = `${utils.format(
        Number(weightMax) * (Number(max) / 100),
        api.baseData.dataPointTypeId
      )}<span class="unit">${unit}</span> <span class="sub-value">(${max}<span class="unit">${baseUnit}</span>)</span>`

      average = `${utils.format(
        Number(weightAverage) * (Number(average) / 100),
        api.baseData.dataPointTypeId
      )}<span class="unit">${unit}</span> <span class="sub-value">(${average}<span class="unit">${baseUnit}</span>)</span>`

      const range = `${min} - ${max}`
      const header = `<div class="header-wrap">
          <p class="value">${average}</p>
          <p class="range">${range}</p>
        </div>`

      headers += header
    })

    document.getElementById('graph-header').innerHTML = headers
  }
}

customElements.define('dashboard-graph-header', GraphHeaderElement)
