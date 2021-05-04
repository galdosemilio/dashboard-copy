import { Injectable } from '@angular/core'
import { ContextService } from '@app/service'
import { bufferedRequests } from '@app/shared'
import { Sequence } from '@coachcare/sdk'
import { SyncState } from '../models'
import { Transition } from '../models/sequence-transition'

/**
 * The logic needs a big rework.
 *
 * First of all, we need to be able to handle creation/updating
 * with a single algorithm. Don't be a lazy fuck.
 *
 * The Sequence object structure goes on more or less like this:
 *
 * - Sequence
 *  - Root State (exists in all the Sequences, except in those that
 *    haven't been synced to the server [i.e., new and unsaved Sequences])
 *  - States
 *  - Transitions (these transitions connect the existing states)
 *    - Triggers (or 'messages', as we call them in the FRON)
 *      - Trigger Localizations
 *
 *  So, let's work on the Creation logic, which seems to be the simplest one.
 *
 *  CREATION LOGIC:
 *  - Create the Sequence object in the server.
 *
 *  - Create the ROOT State, using the Sequence as the parent.
 *
 *  - Create the States, using the Sequence as the parent.
 *
 *  - Create the Transitions, using the existing States to link them.
 *
 *  - Create the Triggers, using the existing Transitions and a slight offset
 *    (due to there being a ROOT State).
 *
 *  - Create the Localizations for each of the Triggers, if necessary.
 *
 *  UPDATE LOGIC:
 *  - Store the Sequence object in a local variable (we need the ID).
 *
 *  - Store the ROOT State object into an State array (we need the ID).
 *
 *  - Store the existing AND new States into the State array (we need all of their IDs).
 *
 *  - If there are new States added, then an issue arises: since Transitions cannot be edited,
 *    the last Transition has to be recreated (along with all of its Triggers and Localizations)
 *    in order to be connected to the new ones.
 *
 *  - Add the required Transitions at the end of the list that connect the new States (if any).
 *
 *  - Finally, create the Triggers for those new Transitions, and finally update the Triggers for the
 *    existing Transitions.
 *
 *  - After all that, evaluate the endingAction and act accordingly (connect it to the beginning or
 *    do nothing).
 */

type TicketAction = 'create' | 'update' | 'delete' | 'recreate' | 'no-action'
type TicketType =
  | 'sequence'
  | 'step'
  | 'transition'
  | 'message'
  | 'localization'

interface MessagePayloadItem {
  id?: string
  content: {
    content: string
    header: string
    message: string
    package: string
    subject: string
    text: string
  }
  language?: string
  stepId?: string
  syncState: SyncState
  type: string
}

interface MessagePayload {
  message: MessagePayloadItem | MessagePayloadItem[]
}

interface StepPayloadItem {
  id?: string
  delay: string
  messages: MessagePayload[]
  name: string
  sequenceId?: string
  syncState: SyncState
}

interface StepPayload {
  step: StepPayloadItem
}

interface SyncPayload {
  message?: MessagePayloadItem
  sequence?: {
    id: string
    endingAction: 'loop' | 'no-action'
    name: string
    steps: StepPayload[]
    syncState: SyncState
    transitions?: Transition[]
  }
  step?: StepPayloadItem
  transition?: any
}

interface SyncerTicket {
  action: TicketAction
  children?: SyncerTicket[]
  payload: SyncPayload
  type: TicketType
}

@Injectable()
export class SequenceSyncer {
  public selectedStepCache: number

  constructor(private context: ContextService, private sequence: Sequence) {}

  sync(formValue: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        formValue.sequence.steps = formValue.sequence.steps.filter(
          (stepObject) =>
            stepObject.step &&
            (stepObject.step.syncState.inServer ||
              !stepObject.step.syncState.deleted)
        )

        let messageTickets = []
        let sequenceStepResponse
        const sequenceStepTickets: SyncerTicket[] = this.resolveTickets(
          formValue
        )
        let transitionTickets: SyncerTicket[] = []

        sequenceStepResponse = await this.processTicket(
          sequenceStepTickets.shift()
        )

        let structureResponses = []
        const structureTickets = this.resolveStructureTickets(
          sequenceStepResponse
        )

        structureResponses = await bufferedRequests(
          structureTickets.map((ticket) => this.processTicket(ticket))
        )

        // update sequenceStepResponse tickets and transitions arrays, they no longer matter
        // after this point. Do it based on the structure responses
        const updatedStructureResponse = {
          children: [...(sequenceStepResponse.children || [])],
          response: {
            transitions: [...(sequenceStepResponse.response.transitions || [])],
            steps: [
              ...(sequenceStepResponse.children.map(
                (child) => child.response
              ) || [])
            ]
          }
        }
        const updatedFormValue = {
          sequence: {
            ...formValue.sequence,
            steps: [
              ...(sequenceStepResponse.children.map(
                (child) => child.response
              ) || [])
            ],
            transitions: [...(formValue.sequence.transitions || [])]
          }
        }

        structureResponses.forEach((structureResponse) => {
          if (structureResponse.action === 'no-action') {
            updatedStructureResponse.response.transitions = updatedStructureResponse.response.transitions.filter(
              (t) => t.id !== structureResponse.response.id
            )
            updatedStructureResponse.response.steps = updatedStructureResponse.response.steps.filter(
              (s) =>
                s.step.name === 'root' ||
                s.step.id !== structureResponse.response.to.id
            )
            updatedStructureResponse.children = updatedStructureResponse.children.filter(
              (c) => c.response.id !== structureResponse.response.to.id
            )

            updatedFormValue.sequence.steps = updatedFormValue.sequence.steps.filter(
              (s) =>
                s.step.name === 'root' ||
                s.step.id !== structureResponse.response.to.id
            )

            updatedFormValue.sequence.transitions = updatedFormValue.sequence.transitions.filter(
              (t) => t.id !== structureResponse.response.id
            )
          } else if (structureResponse.action === 'create') {
            const affectedTransitionIndex = updatedStructureResponse.response.transitions.findIndex(
              (t) => t.from.id === structureResponse.response.transition.from
            )

            if (affectedTransitionIndex > -1) {
              updatedStructureResponse.response.transitions[
                affectedTransitionIndex
              ] = {
                ...structureResponse.response.transition,
                from: { id: structureResponse.response.transition.from },
                to: { id: structureResponse.response.transition.to },
                syncState: {
                  ...structureResponse.response.syncState,
                  edited: false,
                  inServer: true
                }
              }

              updatedFormValue.sequence.transitions[affectedTransitionIndex] = {
                ...structureResponse.response.transition,
                from: { id: structureResponse.response.transition.from },
                to: { id: structureResponse.response.transition.to },
                syncState: {
                  ...structureResponse.response.syncState,
                  edited: false,
                  inServer: true
                }
              }
            }
          }
        })

        if (structureResponses.length) {
          sequenceStepResponse = {
            ...sequenceStepResponse,
            ...updatedStructureResponse
          }
          formValue = { ...formValue, ...updatedFormValue }
        } else {
          formValue.sequence.steps = sequenceStepResponse.children.map(
            (child) => child.response
          )
        }

        transitionTickets = this.resolveTransitionTickets(
          formValue,
          sequenceStepResponse
        )

        let transitionResponses = []

        const rootStateTicket = sequenceStepResponse.children.find(
          (children) => children.response.step.name === 'root'
        )

        const lastStateTicket =
          sequenceStepResponse.children[
            sequenceStepResponse.children.length - 1
          ]
        const existingLoopTransition = rootStateTicket
          ? transitionTickets.find(
              (t) => t.payload.transition.to.id === rootStateTicket.response.id
            )
          : undefined

        if (existingLoopTransition) {
          try {
            await this.processTicket({
              action: 'delete',
              payload: {
                transition: { id: existingLoopTransition.payload.transition.id }
              },
              type: 'transition'
            })
          } catch (error) {}
        }

        transitionResponses = await this.processTicketsByAction(
          transitionTickets,
          ['delete', 'update', 'create', 'no-action']
        )

        const messageResponses = []

        messageTickets = [
          ...formValue.sequence.steps.map((stepObject, index) => {
            const transitionIndex = transitionResponses.findIndex(
              (t) =>
                t.response.transition.to.id === stepObject.step.id ||
                t.response.transition.to === stepObject.step.id
            )

            return (
              transitionIndex > -1 &&
              stepObject.step.name !== 'root' &&
              !stepObject.step.syncState.deleted &&
              this.resolveMessageTickets(stepObject.step.messages, {
                forceAction:
                  transitionResponses[transitionIndex - 1] &&
                  transitionResponses[transitionIndex - 1].action === 'update'
                    ? 'create'
                    : undefined,
                transitionId: transitionResponses[transitionIndex].response.id
              })
            )
          })
        ].filter((messageTicket) => messageTicket)

        const transitionResponsesCopy = transitionResponses
          .slice()
          .filter(
            (t) =>
              !rootStateTicket ||
              t.response.transition.to.id !== rootStateTicket.response.id ||
              t.response.transition.to !== rootStateTicket.response.id
          )

        while (messageTickets.length) {
          const messageTicket = messageTickets.shift()
          const transitionResponse = messageTicket.length
            ? transitionResponsesCopy.find(
                (tR) => tR.response.id === messageTicket[0].payload.transitionId
              )
            : undefined

          messageResponses.push(
            ...(await bufferedRequests(
              messageTicket.map((ticket) =>
                this.processTicket(ticket, {
                  transition: transitionResponse.response
                })
              )
            ))
          )
        }

        // detect and act on ending action
        if (formValue.sequence.endingAction === 'repeat') {
          try {
            // repeat
            await this.processTicket({
              action: 'create',
              payload: {
                transition: {
                  from: lastStateTicket.response.id,
                  to: rootStateTicket.response.id,
                  delay: this.calculateLoopingDelay(formValue)
                }
              },
              type: 'transition'
            })
          } catch (error) {}
        } else {
          // no action
        }

        resolve(sequenceStepResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  private calculateLoopingDelay(formValue: any): string {
    let delay = ''

    let closestStep = formValue.sequence.steps
      .slice()
      .reverse()
      .find((step) => {
        return step.step
          ? step.step.syncState && !step.step.syncState.deleted
          : step.syncState && !step.syncState.deleted
      })

    closestStep =
      closestStep && closestStep.step ? closestStep.step : closestStep

    if (closestStep) {
      if (closestStep.delayHour && closestStep.delayHour !== '00:00:00') {
        const hourAmount = Number(closestStep.delayHour.split(':')[0])
        delay = `${24 - hourAmount}:00:00`
      } else {
        delay = '24:00:00'
      }
    }

    return delay
  }

  private detectDominantAction(state: SyncState): TicketAction {
    if (state.inServer) {
      if (state.deleted) {
        return 'delete'
      }

      if (state.edited) {
        return 'update'
      }
    } else {
      if (state.deleted) {
        return 'no-action'
      }

      if (state.new) {
        return 'create'
      }
    }

    return 'no-action'
  }

  private processTicket(
    ticket: SyncerTicket,
    parentResponse?: any
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let response
        switch (ticket.type) {
          case 'localization':
            response = await this.runMessageLocAction(ticket, parentResponse)
            break

          case 'message':
            response = await this.runMessageAction(ticket, parentResponse)
            break

          case 'sequence':
            response = await this.runSequenceAction(ticket)
            break

          case 'step':
            response = await this.runStepAction(ticket, parentResponse)
            break

          case 'transition':
            response = await this.runTransitionAction(ticket, parentResponse)
            break
        }

        const childrenResponses = []
        if (ticket.children && ticket.children.length) {
          while (ticket.children.length) {
            const childTicket = ticket.children.shift()
            childrenResponses.push(
              await this.processTicket(childTicket, response)
            )
          }
        }

        resolve({
          action: response.action || ticket.action,
          type: ticket.type,
          response: {
            ...response,
            ...ticket.payload,
            [ticket.type]: { ...ticket.payload[ticket.type], ...response }
          },
          children: childrenResponses || []
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  private processTicketsByAction(
    tickets: SyncerTicket[],
    actions: string[] = []
  ) {
    return new Promise<any>(async (resolve, reject) => {
      const responses = []
      for (const action of actions) {
        const actionTicketsIndexes = []

        tickets.forEach((t, index) => {
          if (t.action === action) {
            actionTicketsIndexes.push(index)
          }
        })

        const actionTickets = tickets.filter(
          (t, index) =>
            index === actionTicketsIndexes.find((aTI) => aTI === index)
        )

        const partialResponses = await bufferedRequests(
          actionTickets.map((aT) => this.processTicket(aT))
        )

        partialResponses.forEach((response, index) => {
          responses[actionTicketsIndexes[index]] = response
        })
      }
      resolve(responses)
    })
  }

  private resolveMessageTickets(
    payload: MessagePayload[] = [],
    opts: { forceAction?: TicketAction; transitionId?: string } = {}
  ): SyncerTicket[] {
    const tickets: SyncerTicket[] = payload.map((message) => {
      const messageObject: any = message
      if (Array.isArray(message.message)) {
        const firstMessage =
          message.message[0] || ((message.message as any) as MessagePayloadItem)
        const dominantAction = this.detectDominantAction(firstMessage.syncState)
        return {
          action:
            opts.forceAction &&
            (dominantAction === 'update' || dominantAction === 'no-action')
              ? opts.forceAction
              : dominantAction,
          children: this.resolveMessageLocTickets(message.message),
          payload: { message: firstMessage, transitionId: opts.transitionId },
          type: 'message' as TicketType
        }
      } else {
        messageObject.message = message.message || message
        const dominantAction = this.detectDominantAction(
          messageObject.message.syncState
        )
        return {
          action:
            opts.forceAction &&
            (dominantAction === 'update' || dominantAction === 'no-action')
              ? opts.forceAction
              : dominantAction,
          children: [],
          payload: {
            message: messageObject.message,
            transitionId: opts.transitionId
          },
          type: 'message' as TicketType
        }
      }
    })

    return tickets
  }

  private resolveMessageLocTickets(
    payload: MessagePayloadItem[] = []
  ): SyncerTicket[] {
    const tickets = payload.map((message) => {
      return {
        type: 'localization' as TicketType,
        action: this.detectDominantAction(message.syncState),
        payload: { message: message }
      }
    })

    return tickets
  }

  private resolveStructureTickets(sequenceStepResponse): SyncerTicket[] {
    const tickets: SyncerTicket[] = []
    const children = sequenceStepResponse.children.map((c) => c)
    const childrenCopy = children.slice()
    const sequenceResponse = sequenceStepResponse.response

    this.resolveStructureTicketItem(
      childrenCopy.slice(),
      childrenCopy,
      sequenceResponse.transitions,
      tickets
    )

    return tickets.sort((t) => {
      if (t.action === 'create') {
        return -1
      } else {
        return 1
      }
    })
  }

  private resolveStructureTicketItem(
    allChildren: any[],
    children: any[],
    transitions: Transition[],
    accumulator: SyncerTicket[] = []
  ): void {
    const currentChildren = children.length > 1 ? children.pop() : undefined
    if (currentChildren) {
      if (currentChildren.action === 'delete') {
        const deletedTransition = transitions.find(
          (t) => t.to.id === currentChildren.response.id
        )

        const affectedTransition = transitions.find(
          (t) => t.from.id === currentChildren.response.id
        )

        const affectedChild = affectedTransition
          ? allChildren.find((c) => c.response.id === affectedTransition.to.id)
          : undefined

        const affectedTransitionTicket = accumulator.find(
          (ticket) =>
            ticket.payload.transition.from === currentChildren.response.id
        )

        accumulator.push({
          action: 'no-action',
          payload: { transition: deletedTransition },
          type: 'transition'
        })

        if (affectedTransition && !affectedTransitionTicket) {
          accumulator.push({
            action: 'create',
            payload: {
              transition: {
                ...affectedTransition,
                delay: affectedChild
                  ? affectedChild.response.serverDelay ||
                    affectedChild.response.delay
                  : affectedTransition.serverDelay ||
                    affectedTransition.delay ||
                    undefined,
                from: deletedTransition.from.id,
                to: affectedTransition.to.id
              }
            },
            type: 'transition'
          })
        } else if (affectedTransitionTicket) {
          const affectedTransitionTicketIndex = accumulator.findIndex(
            (ticket) =>
              ticket.payload.transition.id ===
              affectedTransitionTicket.payload.transition.id
          )

          if (affectedTransitionTicketIndex > -1) {
            accumulator.splice(affectedTransitionTicketIndex, 1)
          }

          accumulator.push({
            action: 'create',
            payload: {
              transition: {
                ...affectedTransitionTicket.payload.transition,
                from: deletedTransition.from.id,
                to: affectedTransitionTicket.payload.transition.to
              }
            },
            type: 'transition'
          })
        }
      }

      const filteredChildren = children.filter(
        (c) => c.response.id !== currentChildren.response.id
      )
      if (filteredChildren.length > 1) {
        this.resolveStructureTicketItem(
          allChildren,
          filteredChildren,
          transitions,
          accumulator
        )
      }
    }
  }

  private resolveTickets(formValue: any): SyncerTicket[] {
    const tickets: SyncerTicket[] = []
    const sequence: SyncPayload['sequence'] = formValue.sequence
    const sequenceTicket: SyncerTicket = {
      action: this.detectDominantAction(sequence.syncState),
      children: [],
      payload: { sequence },
      type: 'sequence'
    }

    if (!formValue.sequence.id) {
      sequenceTicket.children.push({
        action: 'create',
        payload: {
          step: {
            delay: undefined,
            messages: [],
            name: 'root',
            syncState: {}
          }
        },
        type: 'step'
      })
    }

    sequenceTicket.children.push(
      ...sequence.steps.map((stepObject) => {
        const stepTicket: SyncerTicket = {
          action:
            stepObject.step.name === 'root'
              ? 'no-action'
              : this.detectDominantAction(stepObject.step.syncState),
          payload: stepObject,
          type: 'step'
        }

        return stepTicket
      })
    )

    tickets.push(sequenceTicket)

    return tickets
  }

  private resolveTransitionTickets(
    formValue: any,
    response: any
  ): SyncerTicket[] {
    const tickets: SyncerTicket[] = []
    const sequence: SyncPayload['sequence'] = formValue.sequence
    const existingTransitions =
      sequence.transitions && sequence.transitions.length
        ? sequence.transitions.map((t) => t)
        : []
    const states =
      response.children && response.children.length ? response.children : []

    existingTransitions.forEach((eT) => {
      const state = states.find((s) =>
        s.response ? s.response.id === eT.to.id : s.id === eT.to.id
      )
      eT.syncState.edited = state
        ? state.response
          ? state.response.syncState.edited
          : state.syncState.edited
        : eT.syncState.edited
    })

    const statesWithoutTransitions =
      states.filter(
        (s) =>
          s.response.name !== 'root' &&
          !s.response.step.syncState.deleted &&
          !existingTransitions.find((t) => t.to.id === s.response.id)
      ) || []

    const updatedTransitions = existingTransitions.filter(
      (t) => t.syncState.edited
    )

    const allTransitions = existingTransitions.filter(
      (t) => !t.syncState.edited
    )

    if (!formValue.sequence.id) {
      states.forEach((state, index) => {
        if (index + 1 >= states.length) {
          return
        }

        tickets.push({
          type: 'transition',
          action: 'create',
          payload: {
            transition: {
              from: state.response.id || undefined,
              to: states[index + 1].response.id,
              delay: `${states[index + 1].response.step.serverDelay}`
            }
          }
        })
      })

      return tickets
    } else {
      statesWithoutTransitions.forEach((state, index) => {
        const stateIndex = states.findIndex((s) =>
          s.response
            ? s.response.id === state.response.id
            : s.id === state.response.id
        )

        const previousState = states[stateIndex - 1]

        tickets.push({
          action: 'create',
          payload: {
            transition: {
              from: previousState.response
                ? previousState.response.id
                : previousState.id,
              to: state.response ? state.response.id : state.id,
              delay: `${state.response.step.serverDelay}`
            }
          },
          type: 'transition'
        })
      })

      updatedTransitions.forEach((transition) => {
        const transitionStepIndex = states.findIndex((s) =>
          s.response
            ? s.response.id === transition.to.id
            : s.id === transition.to.id
        )

        let transitionStep = states[transitionStepIndex]

        transitionStep = transitionStep
          ? transitionStep.response || transitionStep
          : null

        const previousStep = states[transitionStepIndex - 1]

        tickets.push({
          action: 'update',
          payload: {
            transition: {
              ...transition,
              from: {
                id: previousStep
                  ? previousStep.response
                    ? previousStep.response.id
                    : previousStep.id
                  : transition.from.id
              },
              delay: transitionStep
                ? `${transitionStep.serverDelay}`
                : `${transition.serverDelay}`
            }
          },
          type: 'transition'
        })
      })

      allTransitions.forEach((transition) => {
        const transitionStepIndex = states.findIndex((s) =>
          s.response
            ? (s.response.step
                ? !s.response.step.syncState.deleted
                : !s.response.syncState.deleted) &&
              s.response.id === transition.to.id
            : !s.step.syncState.deleted && s.id === transition.to.id
        )

        let transitionStep = states[transitionStepIndex]

        transitionStep = transitionStep
          ? transitionStep.response || transitionStep
          : null

        tickets.push({
          action: 'no-action',
          payload: {
            transition: {
              ...transition,
              delay: transitionStep
                ? transitionStep.serverDelay
                : transition.delay
            }
          },
          type: 'transition'
        })
      })

      const sortedTickets = []

      states.forEach((state) => {
        const ticketIndex = tickets.findIndex(
          (t) =>
            (t.payload.transition.from.id || t.payload.transition.from) ===
            state.response.step.id
        )
        if (ticketIndex > -1) {
          sortedTickets.push(tickets.splice(ticketIndex, 1)[0])
        }
      })

      if (tickets.length) {
        sortedTickets.push(...tickets)
      }

      return sortedTickets
    }
  }

  private runMessageAction(
    ticket: SyncerTicket,
    parentResponse: any = {}
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let response
      const message = ticket.payload.message
      try {
        switch (ticket.action) {
          case 'update':
            try {
              await this.sequence.updateSequenceTriggerMetadata({
                id: ticket.payload.message.id,
                isActive: false
              })
            } catch (error) {}
          case 'create':
            response = await this.sequence.createSequenceTrigger({
              organization: this.context.organizationId,
              transition: parentResponse.transition.id,
              trigger: {
                type: message.type || undefined,
                message:
                  message.content.text ||
                  message.content.content ||
                  message.content.message ||
                  undefined,
                content:
                  message.content.text ||
                  message.content.content ||
                  message.content.message ||
                  undefined,
                package: message.content.package || undefined,
                header: message.content.header || undefined,
                subject: message.content.subject || undefined,
                title:
                  message.content.subject || message.content.header || undefined
              } as any
            })
            break

          case 'delete':
            await this.sequence.updateSequenceTriggerMetadata({
              id: ticket.payload.message.id,
              isActive: false
            })
            break

          case 'recreate':
            await this.sequence.updateSequenceTriggerMetadata({
              id: ticket.payload.message.id,
              isActive: false
            })

            response = await this.sequence.createSequenceTrigger({
              organization: this.context.organizationId,
              transition: parentResponse.transition.id,
              trigger: {
                type: message.type || undefined,
                message:
                  message.content.text ||
                  message.content.content ||
                  message.content.message ||
                  undefined,
                content:
                  message.content.text ||
                  message.content.content ||
                  message.content.message ||
                  undefined,
                header: message.content.header || undefined,
                subject: message.content.subject || undefined,
                title:
                  message.content.subject || message.content.header || undefined
              } as any
            })
            break
        }
        resolve(response || message)
      } catch (error) {
        resolve(response || message)
      }
    })
  }

  private runMessageLocAction(
    ticket: SyncerTicket,
    parentResponse: any = {}
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let response
        const payload = ticket.payload
        const message = payload.message
        switch (ticket.action) {
          case 'create':
          case 'update':
            response = await this.sequence.createSequenceTriggerLocale({
              id: parentResponse.id,
              locale: message.language,
              organization: this.context.organizationId,
              payload: {
                message:
                  message.content.text ||
                  message.content.content ||
                  message.content.message ||
                  undefined,
                content:
                  message.content.text ||
                  message.content.content ||
                  message.content.message ||
                  undefined,
                header: message.content.header || undefined,
                subject: message.content.subject || undefined,
                title:
                  message.content.subject || message.content.header || undefined
              }
            })
            break

          case 'delete':
            await this.sequence.deleteSequenceTriggerLocale({
              id: message.id,
              locale: message.language,
              organization: this.context.organizationId
            })
            break
        }
        resolve(response || payload)
      } catch (error) {
        reject(error)
      }
    })
  }

  private runSequenceAction(ticket: SyncerTicket): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let response
        switch (ticket.action) {
          case 'create':
            response = await this.sequence.createSequence({
              association: { isActive: true },
              name: ticket.payload.sequence.name,
              createdBy: this.context.user.id,
              isActive: true,
              organization: this.context.organizationId
            })
            break

          case 'update':
            await this.sequence.updateSequence({
              id: ticket.payload.sequence.id,
              name: ticket.payload.sequence.name,
              organization: this.context.organizationId
            })
            break
        }

        resolve(response || ticket.payload.sequence)
      } catch (error) {
        reject(error)
      }
    })
  }

  private runStepAction(
    ticket: SyncerTicket,
    parentResponse: any = {}
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let response
        switch (ticket.action) {
          case 'create':
            response = await this.sequence.createSequenceState({
              createdBy: this.context.user.id,
              name: ticket.payload.step.name,
              sequence: parentResponse.id,
              organization: this.context.organizationId
            })
            break

          case 'delete':
            await this.sequence.deleteSequenceState({
              id: ticket.payload.step.id
            })
            break

          case 'update':
            await this.sequence.updateSequenceState({
              id: ticket.payload.step.id,
              name: ticket.payload.step.name,
              organization: this.context.organizationId
            } as any)
            break
        }
        resolve(response || { ...ticket.payload.step, ...response })
      } catch (error) {
        reject(error)
      }
    })
  }

  private runTransitionAction(
    ticket: SyncerTicket,
    params: { from: string; to: string }
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      let response
      try {
        switch (ticket.action) {
          case 'delete':
            await this.sequence.deleteSeqTransition({
              id: ticket.payload.transition.id,
              organization: this.context.organizationId
            })
            break
          case 'create':
            response = await this.sequence.createSeqTransition({
              createdBy: this.context.user.id,
              delay: ticket.payload.transition.delay || undefined,
              organization: this.context.organizationId,
              from: ticket.payload.transition.from || undefined,
              to: ticket.payload.transition.to || undefined
            })
            break

          case 'update':
            await this.sequence.deleteSeqTransition({
              id: ticket.payload.transition.id,
              organization: this.context.organizationId
            })
            response = await this.sequence.createSeqTransition({
              createdBy: this.context.user.id,
              delay: ticket.payload.transition.delay || undefined,
              organization: this.context.organizationId,
              from: ticket.payload.transition.from.id || undefined,
              to: ticket.payload.transition.to.id || undefined
            })
            break
        }
        resolve(response || ticket.payload.transition)
      } catch (error) {
        resolve(
          response || {
            ...ticket.payload.transition,
            action: ticket.action === 'delete' ? ticket.action : 'failed-update'
          }
        )
        reject(error)
      }
    })
  }
}
