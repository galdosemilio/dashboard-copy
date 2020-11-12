export interface State {
  language: string
  loaded: boolean
  loggedIn: boolean
  account: string // CcrRol
}

export const initialState: State = {
  language: '',
  loaded: false,
  loggedIn: false,
  account: ''
}
