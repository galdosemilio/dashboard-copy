import { Injectable } from '@angular/core'
import { CanDeactivate } from '@angular/router'
import { LibraryFormComponent } from '@app/dashboard/library/forms/form/form.component'
import { Observable } from 'rxjs'

@Injectable()
export class FormEditGuard implements CanDeactivate<LibraryFormComponent> {
  canDeactivate(component: LibraryFormComponent): Observable<boolean> {
    return component.canDeactivate()
  }
}
