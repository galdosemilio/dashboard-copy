import { Injectable } from '@angular/core'
import { BillableService, Interaction } from '@coachcare/sdk'
import { Subject } from 'rxjs'
import { debounceTime, delay } from 'rxjs/operators'
import { NotifierService } from './notifier.service'

@Injectable()
export class CallControlService {
  billableServices$ = new Subject<BillableService[]>()

  private getBillableServices$ = new Subject<void>()
  private billableServices: BillableService[] = []

  constructor(
    private interaction: Interaction,
    private notifier: NotifierService
  ) {
    this.getBillableServices$.pipe(debounceTime(1000)).subscribe(async () => {
      if (this.billableServices.length > 0) {
        this.billableServices$.next(this.billableServices)
        return
      }

      try {
        const res = await this.interaction.getBillableServices({
          limit: 'all',
          status: 'active'
        })

        this.billableServices$.next(res.data)
        this.billableServices = res.data
      } catch (error) {
        this.notifier.error(error)
      }
    })

    this.billableServices$.pipe(delay(10000)).subscribe(() => {
      this.billableServices = []
    })
  }

  getBillableServices(): void {
    this.getBillableServices$.next()
  }
}
