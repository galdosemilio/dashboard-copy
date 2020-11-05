import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { ContextService, NotifierService } from '@app/service'
import { Sequence as SelveraSequenceProvider } from '@coachcare/npm-api'
import { Sequence } from '../models'

@Injectable()
export class SequenceResolver implements Resolve<Sequence> {
  constructor(
    private context: ContextService,
    private notify: NotifierService,
    private sequence: SelveraSequenceProvider
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Sequence> {
    return new Promise<Sequence>(async (resolve, reject) => {
      try {
        const id = route.paramMap.get('id')
        const response = await this.sequence.getSequence({
          id: id,
          full: true,
          organization: this.context.organizationId,
          status: 'all'
        })
        const sequence = new Sequence(response, { inServer: true })
        resolve(sequence)
      } catch (error) {
        this.notify.error(error)
        reject(error)
      }
    })
  }
}
