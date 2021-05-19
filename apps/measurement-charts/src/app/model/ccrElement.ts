/* eslint-disable @typescript-eslint/no-empty-function */

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

  connectedCallback() {
    this.mapAttributes()
    this.onInit()
    this.render()
    this.afterViewInit()
  }

  disconnectedCallback() {
    this.onDestroy()
  }

  afterViewInit(): void {}

  onDestroy(): void {}

  onInit(): void {}

  render(): void {}

  private mapAttributes(): void {
    Object.values(this.attributes).forEach(
      (attr) => (this.attrs[attr.name] = attr.value)
    )
  }

  protected get isRtl() {
    return document.body.getAttribute('dir') === 'rtl'
  }
}
