import { CcrElement, Modal } from '@chart/model'
import { modalService } from '@chart/service'
import { Subscription } from 'rxjs'

import './modal.element.scss'

export class ModalElement extends CcrElement {
  private subscriptions: Subscription[] = []

  onDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  afterViewInit(): void {
    this.subscriptions.push(
      modalService.open$.subscribe((content) => this.onOpenModal(content))
    )
    this.subscriptions.push(
      modalService.close$.subscribe(() => this.onCloseModal())
    )

    document
      .getElementById('close-btn')
      .addEventListener('click', () => this.onCloseModal())
  }

  render(): void {
    this.innerHTML = `
      <div id='modal'>
        <div id='modal-wrap'>
          <div id='modal-header'>
            <div id='close-btn'></div>
            <div id='modal-title'></div>
          </div>
          <div id='modal-body'></div>
        </div>
      </div>
    `
  }

  private onOpenModal(data: Modal | null) {
    if (!data) return

    const { title, content } = data
    document.getElementById('modal-title').innerText = title
    document.getElementById('modal-body').innerHTML = content
    document
      .getElementById('modal')
      .setAttribute('class', `open ${data.full ? 'full' : ''}`)
  }

  private onCloseModal() {
    document.getElementById('modal-title').innerText = ''
    document.getElementById('modal-body').innerText = ''
    document.getElementById('modal').setAttribute('class', '')
  }
}

customElements.define('dashboard-modal', ModalElement)
