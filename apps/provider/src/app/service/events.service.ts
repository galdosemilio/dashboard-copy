import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type CcrEventType =
  | 'add-measurement.section.change'
  | 'boot'
  | 'dieter.measurement.refresh'
  | 'phases.assoc.added'
  | 'phases.assoc.removed'
  | 'right-panel.component.set'
  | 'right-panel.consultation.display.set-as-unavailable'
  | 'right-panel.consultation.editing'
  | 'right-panel.consultation.form'
  | 'right-panel.consultation.meeting'
  | 'right-panel.deactivate'
  | 'schedule.table.refresh'
  | 'schedule.table.selected'
  | 'system.threads.unread'
  | 'system.threads.new-message'
  | 'system.timer'
  | 'user.data'
  | 'videoconferencing.ratingWindow.setState'
  | 'reports.controls'

export type CcrEvent = {
  name: CcrEventType
  data?: any
}

export type CcrEventListener = (data: any) => void

@Injectable({ providedIn: 'root' })
export class EventsService {
  /**
   * Events Bus
   */
  bu$ = new BehaviorSubject<CcrEvent>({ name: 'boot' })

  /**
   * Event Listeners
   */
  listeners: { [name: string]: CcrEventListener[] } = {}

  /**
   * Listeners map
   */
  map: { [name: string]: Array<string> } = {}

  constructor() {
    this.bu$.subscribe((e: CcrEvent) => {
      if (this.listeners[e.name]) {
        this.listeners[e.name].forEach((listener) => listener(e.data))
      }
    })

    setInterval(() => {
      this.trigger('system.timer')
    }, 30000)
  }

  trigger(name: CcrEventType, data: any = null) {
    this.bu$.next({ name, data })
  }

  register(name: CcrEventType, listener: CcrEventListener): string {
    return this.listen(name, listener)
  }

  listen(name: CcrEventType, listener: CcrEventListener): string {
    // initialize the listeners
    if (!this.listeners[name]) {
      this.listeners[name] = []
      this.map[name] = []
    }
    // add the subscription to the listeners
    const num = this.listeners[name].push(listener)
    // maps the listener
    const id = `${num}_${+new Date()}`
    this.map[name].push(id)
    // returns the identifier
    return id
  }

  unlisten(name: CcrEventType, id: string) {
    if (!this.listeners[name] || !this.listeners[name].length) {
      return
    }

    const pos = this.map[name].indexOf(id)
    // remove the listener and map
    this.listeners[name].splice(pos, 1)
    this.map[name].splice(pos, 1)
  }

  unregister(name: CcrEventType) {
    if (this.listeners[name]) {
      this.listeners[name] = []
      this.map[name] = []
    }
  }
}
