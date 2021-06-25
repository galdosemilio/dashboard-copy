/* eslint-disable @typescript-eslint/no-empty-function */

import { Subscription } from 'rxjs'

export interface CcrElementInterface {
  afterViewInit(): void
  onDestroy(): void
  onInit(): void
  render(): void
}

export class CcrElement<T = Record<string, unknown>>
  extends HTMLElement
  implements CcrElementInterface {
  protected attrs: T = {} as T
  protected subscriptions: Subscription[] = []

  connectedCallback() {
    this.mapAttributes()
    this.onInit()
    this.render()
    this.afterViewInit()
  }

  disconnectedCallback() {
    this.clearSubscriptions()
    this.onDestroy()
  }

  afterViewInit(): void {}

  onDestroy(): void {}

  onInit(): void {}

  render(): void {}

  private clearSubscriptions(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  private mapAttributes(): void {
    Object.values(this.attributes).forEach(
      (attr) => (this.attrs[attr.name] = attr.value)
    )
  }

  protected get isRtl() {
    return document.body.getAttribute('dir') === 'rtl'
  }
}
