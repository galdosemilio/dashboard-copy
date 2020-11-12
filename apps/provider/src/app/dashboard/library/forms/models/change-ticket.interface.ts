export const CHANGE_TICKET_ACTIONS: { [id: string]: string } = {
  ['create']: 'create',
  ['delete']: 'delete',
  ['edit']: 'edit',
  ['recreate']: 'recreate'
}

export const CHANGE_TICKET_TYPE: { [id: string]: string } = {
  ['section']: 'section',
  ['question']: 'question'
}

export interface ChangeTicketDependency {
  id: string
  source: string
  target: string
}

export interface ChangeTicket {
  action: string
  payload: any
  type: string
  dependencies?: ChangeTicketDependency[]
}
