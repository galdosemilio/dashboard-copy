import { CcrElement } from '@chart/model'
import './graph-header.element.scss'

export class GraphHeaderElement extends CcrElement {
  render() {
    this.innerHTML = `
      <div>
        <dashboard-date-range-selector></dashboard-date-range-selector>

        This is the Graph Header Element
      </div>
    `
  }
}

customElements.define('dashboard-graph-header', GraphHeaderElement)
