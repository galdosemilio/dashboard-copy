export class GraphElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id='graph-content'>
        <dashboard-graph-timeframe-selector></dashboard-graph-timeframe-selector>
        <dashboard-graph-header></dashboard-graph-header>

        <div>This is where the graph should appear</div>
      </div>
    `
  }
}

customElements.define('dashboard-graph', GraphElement)
