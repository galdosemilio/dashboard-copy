import { Pipe, PipeTransform } from '@angular/core'
import { ContextService } from '@app/service'
import { Entity } from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Pipe({ name: 'organizationName' })
export class OrganizationNamePipe implements PipeTransform {
  constructor(private context: ContextService) {}

  public transform(value: Entity): Observable<string> {
    return from(this.context.getOrg(value.id)).pipe(
      map((organization) => organization.name),
      catchError(() => value.id)
    )
  }
}
