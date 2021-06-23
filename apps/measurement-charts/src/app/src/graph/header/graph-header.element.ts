import { CcrElement, GraphHeader, Tab } from '@chart/model'
import { tabService } from '@chart/service'
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
    tabService.selectedTab$.subscribe((tab) => {
      // for now, the header is setup when change tab.
      // but it need to set after get charts data when we integration charts endpoints
      if (tab === Tab.GRAPH) {
        this.setHeader()
      }
    })
  }

  private setHeader() {
    const data: GraphHeader = {
      value: 100,
      range: {
        min: 222,
        max: 333
      },
      unit: 'lbs'
    }

    const value = data.value as number
    const range = `${data.range.min}<span class="unit">${data.unit}</span>- ${data.range.max}<span class="unit">${data.unit}</span>`

    document.getElementById('graph-header').innerHTML = `
      <div class="average-wrap">
        <p class="value">${value}<span class="unit">${data.unit}</span></p>
        <p class="range">${range}</p>
      </div>
    `
  }
}

customElements.define('dashboard-graph-header', GraphHeaderElement)
