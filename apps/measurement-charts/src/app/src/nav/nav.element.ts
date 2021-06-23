import { CcrElement, Tab } from '@chart/model'
import { tabService } from '@chart/service'
import { Subscription } from 'rxjs'

import './nav.element.scss'

export class NavElement extends CcrElement {
  private subscriptions: Subscription[] = []

  onDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  afterViewInit(): void {
    this.subscriptions.push(
      tabService.selectedTab$.subscribe((tab) => this.onChangeTab(tab))
    )
  }

  render(): void {
    this.innerHTML = `
    <div class="tab-group">
      ${this.renderNavButtons()}
    </div>

    <div class='wrapper'>
      <div id='list-wrapper'>
        <dashboard-list></dashboard-list>
      </div>
      <div id='graph-wrapper'>
        <dashboard-graph></dashboard-graph>
      </div>
      <div id="loading-wrapper">
        <div class="loading-bar"><div></div><div></div><div></div><div></div></div>
      </div>
      <div id="error"></div>
    </div>`
  }

  private onChangeTab(tab: Tab) {
    if (tab === Tab.GRAPH) {
      document.getElementById('list-wrapper').hidden = true
      document.getElementById('graph-wrapper').hidden = false
    } else {
      document.getElementById('list-wrapper').hidden = false
      document.getElementById('graph-wrapper').hidden = true
    }

    document.getElementById('error').style.display = 'none'
  }

  private renderNavButtons(): string {
    return Object.values(Tab).reduce(
      (render, tab) =>
        (render += `<ccr-nav-item link="${tab}" name="${tab}"></ccr-nav-item>`),
      ''
    )
  }
}

customElements.define('dashboard-nav', NavElement)
