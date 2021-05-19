import { Modal } from '@chart/model'
import { BehaviorSubject } from 'rxjs'

class ModalService {
  public open$: BehaviorSubject<Modal | null> = new BehaviorSubject<Modal | null>(
    null
  )
  public close$: BehaviorSubject<void> = new BehaviorSubject<void>(null)
}

const modalService = new ModalService()

export { modalService }
