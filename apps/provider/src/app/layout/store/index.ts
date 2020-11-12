export * from './layout/index'
export * from './responsive/index'
export * from './selector'
export * from './state'

import { reducers } from './reducer'
import { name } from './selector'

export const store = {
  name,
  reducers,
  config: {}
}

export { effects } from './effects'
