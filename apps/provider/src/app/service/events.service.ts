import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export type CcrEvent = {
  name: string
  data?: any
}

export type CcrEventListener = (data: any) => void

@Injectable()
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

  trigger(name: string, data: any = null) {
    this.bu$.next({ name, data })
  }

  register(name: string, listener: CcrEventListener): string {
    return this.listen(name, listener)
  }

  listen(name: string, listener: CcrEventListener): string {
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

  unlisten(name: string, id: string) {
    if (!this.listeners[name] || !this.listeners[name].length) {
      return
    }

    const pos = this.map[name].indexOf(id)
    // remove the listener and map
    this.listeners[name].splice(pos, 1)
    this.map[name].splice(pos, 1)
  }

  unregister(name: string) {
    if (this.listeners[name]) {
      this.listeners[name] = []
      this.map[name] = []
    }
  }
}
