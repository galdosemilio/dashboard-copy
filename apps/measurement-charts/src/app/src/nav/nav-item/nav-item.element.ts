import { CcrElement, Tab } from '@chart/model'
import { translate } from '@chart/service/i18n'
import { tabService } from '@chart/service'

import './nav-item.element.scss'

interface NavItemElementAttrs {
  link: Tab
  name: string
}

export class NavItemElement extends CcrElement<NavItemElementAttrs> {
  private tabItemId: string

  afterViewInit(): void {
    this.subscribeToTabService()
    this.createEventListeners()
  }

  onInit(): void {
    this.tabItemId = `#nav-item-${this.attrs.link}`
  }

  render(): void {
    this.innerHTML = `<div id="nav-item-${
      this.attrs.link
    }" class="tab">${translate(this.attrs.name.toUpperCase())}</div>`
  }

  private createEventListeners(): void {
    document
      .querySelector(this.tabItemId)
      .addEventListener('click', () =>
        tabService.selectedTab$.next(this.attrs.link)
      )
  }

  private refreshTabState(tab: Tab): void {
    if (tab === this.attrs.link) {
      document.querySelector(this.tabItemId).classList.add('active')
    } else {
      document.querySelector(this.tabItemId).classList.remove('active')
    }
  }

  private subscribeToTabService(): void {
    this.subscriptions.push(
      tabService.selectedTab$.subscribe((tab) => this.refreshTabState(tab))
    )
  }
}

customElements.define('ccr-nav-item', NavItemElement)
