import {
  CHANGE_TICKET_ACTIONS,
  CHANGE_TICKET_TYPE,
  ChangeTicket,
  ChangeTicketDependency,
  FormQuestion,
  FormSection,
  QUESTION_TYPE_MAP
} from '@app/dashboard/library/forms/models'
import { FormsDatasource } from '@app/dashboard/library/forms/services'

export class FormsSyncer {
  constructor(private source: FormsDatasource) {}

  public syncSections(sections: FormSection[]): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const changeTickets: ChangeTicket[] = []
        sections.forEach((s: FormSection) => {
          const changeTicket: ChangeTicket = this.checkElementChanges(
            s,
            CHANGE_TICKET_TYPE.section
          )
          changeTickets.push(changeTicket)
          if (changeTicket.action === CHANGE_TICKET_ACTIONS.delete) {
            s.questions.forEach((q: FormQuestion) =>
              changeTickets.push({
                action: CHANGE_TICKET_ACTIONS.delete,
                payload: q,
                type: CHANGE_TICKET_TYPE.question
              })
            )
          } else if (changeTicket.action === CHANGE_TICKET_ACTIONS.create) {
            s.questions.forEach((q: FormQuestion) =>
              changeTicket.dependencies.push({
                id: q.id,
                source: 'id',
                target: 'section.id'
              })
            )

            s.questions.forEach((q: FormQuestion) =>
              changeTickets.push(
                this.checkElementChanges(q, CHANGE_TICKET_TYPE.question)
              )
            )
          } else {
            s.questions.forEach((q: FormQuestion) =>
              changeTickets.push(
                this.checkElementChanges(q, CHANGE_TICKET_TYPE.question)
              )
            )
          }
        })

        // See the changeTickets to know the changes that will be applied -- Zcyon
        // console.log(changeTickets.map(cT => cT));
        while (changeTickets.length) {
          const ticket: ChangeTicket = changeTickets.shift()
          const response: any = await this.executeAction(ticket)
          ticket.payload =
            ticket.dependencies && ticket.dependencies.length
              ? response
              : ticket.payload

          if (ticket.dependencies) {
            await this.resolveDependencies(ticket, changeTickets)
          }
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  private checkElementChanges(
    element: any,
    type: string,
    deps: ChangeTicketDependency[] = []
  ): ChangeTicket {
    const changeTicket: ChangeTicket = {
      action: this.getDominantAction(element),
      payload: element,
      type: type,
      dependencies: deps
    }

    if (
      changeTicket.type === CHANGE_TICKET_TYPE.question &&
      !QUESTION_TYPE_MAP[changeTicket.payload.questionType.id]
        .requiresValueList &&
      !QUESTION_TYPE_MAP[changeTicket.payload.questionType.id]
        .requiresNumericRange
    ) {
      changeTicket.payload.allowedValues =
        changeTicket.action === 'create' ? undefined : null
    }

    return changeTicket
  }

  private executeAction(changeTicket: ChangeTicket): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let value
      try {
        switch (changeTicket.type) {
          case CHANGE_TICKET_TYPE.section:
            value = await this.executeSectionAction(changeTicket)
            break

          case CHANGE_TICKET_TYPE.question:
            value = await this.executeQuestionAction(changeTicket)
            break
        }

        resolve(value)
      } catch (error) {
        reject(error)
      }
    })
  }

  private executeQuestionAction(changeTicket: ChangeTicket): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let value
      try {
        switch (changeTicket.action) {
          case CHANGE_TICKET_ACTIONS.create:
            value = await this.source.createFormQuestion(changeTicket.payload)
            break

          case CHANGE_TICKET_ACTIONS.edit:
            value = await this.source.updateFormQuestion(changeTicket.payload)
            break

          case CHANGE_TICKET_ACTIONS.delete:
            if (changeTicket.payload.inServer) {
              value = await this.source.deleteFormQuestion(changeTicket.payload)
            }
            break

          case CHANGE_TICKET_ACTIONS.recreate:
            if (changeTicket.payload.inServer) {
              await this.source.deleteFormQuestion(changeTicket.payload)
            }

            value = await this.source.createFormQuestion(changeTicket.payload)
        }
        resolve(value)
      } catch (error) {
        reject(error)
      }
    })
  }

  private executeSectionAction(changeTicket: ChangeTicket): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let value
      try {
        switch (changeTicket.action) {
          case CHANGE_TICKET_ACTIONS.create:
            value = await this.source.createFormSection(changeTicket.payload)
            break

          case CHANGE_TICKET_ACTIONS.edit:
            value = await this.source.updateFormSection(changeTicket.payload)
            break

          case CHANGE_TICKET_ACTIONS.delete:
            if (changeTicket.payload.inServer) {
              value = await this.source.deleteFormSection(changeTicket.payload)
            }
            break
        }
        resolve(value)
      } catch (error) {
        reject(error)
      }
    })
  }

  private getDominantAction(element: any): string {
    return element.deleted
      ? CHANGE_TICKET_ACTIONS.delete
      : element.recreated
      ? CHANGE_TICKET_ACTIONS.recreate
      : element.created
      ? CHANGE_TICKET_ACTIONS.create
      : element.edited
      ? CHANGE_TICKET_ACTIONS.edit
      : ''
  }

  private resolveDependencies(
    changeTicket: ChangeTicket,
    allTickets: ChangeTicket[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Somehow forgot why this works? https://stackoverflow.com/a/6605767 --Zcyon
        changeTicket.dependencies.forEach((dep: ChangeTicketDependency) => {
          const depTarget: ChangeTicket = allTickets.find(
            (cT: ChangeTicket) => cT.payload.id === dep.id
          )
          if (depTarget) {
            let targetProp = depTarget.payload,
              sourceProp = changeTicket.payload

            const destinationRoute = dep.target.split('.'),
              sourceRoute = dep.source.split('.')

            const lastDestination = destinationRoute.splice(-1, 1)[0],
              lastSource = sourceRoute.splice(-1, 1)[0]

            destinationRoute.forEach((key: string) => {
              targetProp = targetProp[key]
            })
            sourceRoute.forEach((key: string) => {
              sourceProp = sourceProp[key]
            })

            targetProp[lastDestination] = sourceProp[lastSource]
          }
        })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}
