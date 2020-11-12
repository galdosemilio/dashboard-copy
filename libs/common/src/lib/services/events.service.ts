import { Injectable } from '@angular/core'
import { remove } from 'lodash'
import { BehaviorSubject } from 'rxjs'

export interface AppEvent {
  name: string
  data?: any
}

export type AppEventListener = (data: any) => void

@Injectable()
export class EventsService {
  /**
   * Events Bus.
   */
  bu$ = new BehaviorSubject<AppEvent>({ name: 'boot' })

  /**
   * Event Listeners.
   */
  listeners: { [name: string]: AppEventListener[] } = {}

  constructor() {
    this.bu$.subscribe((e: AppEvent) => {
      if (this.listeners[e.name]) {
        this.listeners[e.name].forEach((listener) => listener(e.data))
      }
    })

    setInterval(() => {
      this.trigger('system.timer')
    }, 30000)
  }

  trigger(name: string, data: any = null): void {
    this.bu$.next({ name, data })
  }

  register(name: string, listener: AppEventListener): void {
    // initialize the listeners
    if (!this.listeners[name]) {
      this.listeners[name] = []
    }
    // add the subscription to the listeners
    this.listeners[name].push(listener)
  }

  unlisten(name: string, listener: AppEventListener): void {
    if (!this.listeners[name] || !this.listeners[name].length) {
      return
    }
    // FIXME workaround for function comparision
    remove(this.listeners[name], (f) => f.toString() === listener.toString())
  }

  unregister(name: string): void {
    if (!this.listeners[name]) {
      this.listeners[name] = []
    }
  }
}
