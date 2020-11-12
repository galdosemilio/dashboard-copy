import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable()
export class FormDisplayService {
  public save$: Subject<void> = new Subject<void>()
  public toggleSave$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )
  public togglePreview$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false)
  public saved$: Subject<void> = new Subject<void>()
}
