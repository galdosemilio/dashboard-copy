import {
  Entity,
  NamedEntity,
  SequenceAssociation,
  SequenceEnrollmentSettings,
  SequenceState as SelveraSequenceState,
  SequenceTransition,
  SequenceTrigger
} from '@coachcare/sdk'
import * as moment from 'moment'
import { Transition } from './sequence-transition'
import { SyncState } from './sync-state'

export interface SequenceMessage extends SequenceTrigger {
  syncState: SyncState
}

export interface SequenceState extends SelveraSequenceState {
  delay: string
  delayHour: string
  messages: SequenceMessage[]
  serverDelay: string
  syncState: SyncState
}

export class Sequence {
  association: SequenceAssociation
  createdAt: string
  createdBy: Entity
  endingAction: any
  enrollment: SequenceEnrollmentSettings | null
  hasLoop?: boolean
  id: string
  isActive: string
  name: string
  organization?: NamedEntity
  states?: SequenceState[]
  syncState: SyncState
  transitions?: SequenceTransition[] | Transition[]

  constructor(args: any, opts: SyncState = {}) {
    this.enrollment = args.enrollment ?? null
    this.association = args.association
      ? {
          createdAt: args.association.createdAt || '',
          createdBy: args.association.createdBy
            ? { id: args.association.createdBy.id || '' }
            : undefined,
          id: args.association.id || '',
          isActive: args.association.isActive || undefined,
          organization: args.association.organization
            ? { id: args.association.organization.id || '' }
            : undefined
        }
      : undefined
    this.createdAt = args.createdAt || ''
    this.createdBy = args.createdBy
      ? { id: args.createdBy.id || '' }
      : undefined
    this.id = args.id || ''
    this.isActive = args.isActive || undefined
    this.name = args.name || ''
    this.organization = args.organization || undefined
    this.states =
      args.states && args.states.length
        ? args.states.map((s) => ({
            createdAt: s.createdAt || '',
            createdBy: s.createdBy ? { id: s.createdBy.id || '' } : undefined,
            delay: s.delay || 'no delay',
            id: s.id || '',
            message: s.message || undefined,
            name: s.name || '',
            syncState: {
              new: opts.new || false,
              edited: opts.edited || false,
              deleted: opts.deleted || false,
              inServer: opts.inServer || false
            }
          }))
        : []
    this.syncState = {
      new: opts.new || false,
      edited: opts.edited || false,
      deleted: opts.deleted || false,
      inServer: opts.inServer || false
    }
    this.transitions =
      args.transitions && args.transitions.length
        ? args.transitions.map((t) => new Transition(t, opts))
        : []
    this.sortTransitionsByRoute()
    this.resolveTransitionDelays()
    this.resolveStateInfo()
    this.sortStatesByTransition()
    this.resolveHasLoop()
  }

  private resolveHasLoop(): void {
    const rootState = this.states.find((s) => s.name === 'root')
    if (!rootState) {
      return
    }
    this.hasLoop = !!(this.transitions as Transition[]).find(
      (t) => t.to.id === rootState.id
    )
  }

  private resolveStateInfo(): void {
    this.states.forEach((state) => {
      const trans = (this.transitions as Transition[]).find(
        (transition) => transition.to.id === state.id
      )
      state.delay = trans && trans.delay ? trans.delay : 'no delay'
      state.delayHour = trans && trans.delayHour ? trans.delayHour : ''
      state.serverDelay = trans && trans.serverDelay ? trans.serverDelay : ''
      state.messages = trans
        ? trans.triggers.map((t) => ({ ...t, syncState: this.syncState }))
        : []
    })
  }

  private resolveTransitionDelays(): void {
    const rootTime = moment().startOf('day')
    let currentTime = moment().startOf('day')

    ;(this.transitions as Transition[]).forEach((transition: Transition) => {
      const prevTime = moment(currentTime)
      const transDelay = {
        delay: transition.delay,
        delayHour: transition.delayHour
      }

      if (transDelay.delay) {
        const dayAmount = +transDelay.delay.split(/\s/)[0]
        currentTime = currentTime.add(dayAmount, 'day')
      }

      if (transDelay.delayHour) {
        const hourAmount = +transDelay.delayHour.split(/\:/)[0]
        currentTime = currentTime.add(hourAmount, 'hour')
      }

      const cache = moment(currentTime)

      const dayDiff = Math.abs(
        Math.abs(prevTime.diff(rootTime, 'days')) -
          Math.abs(currentTime.diff(rootTime, 'days'))
      )
      if (dayDiff) {
        transition.delay = `${dayDiff} ${dayDiff > 1 ? 'days' : 'day'}`
        currentTime = currentTime.subtract(dayDiff, 'days')
      }
      const hour = currentTime.format('HH')
      transition.delayHour = `${hour}:00:00`
      currentTime = cache
    })
  }

  private sortStatesByTransition(): void {
    const rootState = this.states.find((s) => s.name === 'root')
    if (!rootState) {
      return
    }
    const rootTransition = (this.transitions as Transition[]).find(
      (t) => t.from.id === rootState.id
    )
    const sortedStates = rootState ? [rootState] : []

    if (rootTransition) {
      let nextState = this.states.find((s) => s.id === rootTransition.to.id)
      let currentTransition = (this.transitions as Transition[]).find(
        (t) => t.from.id === nextState.id
      )
      while (currentTransition && currentTransition.from.id !== rootState.id) {
        sortedStates.push(nextState)
        nextState = this.states.find((s) => s.id === currentTransition.to.id)
        currentTransition = (this.transitions as Transition[]).find(
          (t) => t.from.id === nextState.id && t.to.id !== rootState.id
        )
      }

      sortedStates.push(nextState)
    }

    this.states = sortedStates
  }

  private sortTransitionsByRoute(): void {
    const rootState = this.states.find((s) => s.name === 'root')
    if (!rootState) {
      return
    }
    const rootTransition = (this.transitions as Transition[]).find(
      (t) => t.from.id === rootState.id
    )

    const sortedTransitions = rootTransition ? [rootTransition] : []

    if (rootTransition) {
      let nextState = this.states.find((s) => s.id === rootTransition.to.id)
      let currentTransition = (this.transitions as Transition[]).find(
        (t) => t.from.id === nextState.id
      )

      while (currentTransition && currentTransition.from.id !== rootState.id) {
        sortedTransitions.push(currentTransition)
        nextState = this.states.find((s) => s.id === currentTransition.to.id)
        currentTransition = (this.transitions as Transition[]).find(
          (t) => t.from.id === nextState.id
        )
      }
    }

    this.transitions = sortedTransitions
  }
}
