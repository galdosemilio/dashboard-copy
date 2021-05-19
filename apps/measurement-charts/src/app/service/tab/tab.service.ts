import { Tab } from '@chart/model'
import { BehaviorSubject } from 'rxjs'

class TabService {
  public selectedTab$: BehaviorSubject<Tab> = new BehaviorSubject<Tab>(Tab.LIST)
}

const tabService = new TabService()

export { tabService }
