import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core'
import { ContextService } from '@app/service'
import { select, Store } from '@ngrx/store'

import { panelCompSelector, UILayoutState } from '@app/layout/store'
import {
  AddMeasurementsV2Component,
  ConsultationComponent,
  NotificationsComponent,
  RemindersComponent
} from './contents'

const Components = {
  addConsultation: ConsultationComponent,
  addMeasurements: AddMeasurementsV2Component,
  notifications: NotificationsComponent,
  reminders: RemindersComponent
}

@Component({
  selector: 'app-right-panel',
  templateUrl: './right-panel.component.html'
})
export class RightPanelComponent implements OnInit {
  @ViewChild('entry', { read: ViewContainerRef, static: true })
  entry: ViewContainerRef

  private activeChild = ''
  childComponent: ComponentRef<any>

  constructor(
    public context: ContextService,
    private resolver: ComponentFactoryResolver,
    private store: Store<UILayoutState>
  ) {}

  ngOnInit() {
    this.store
      .pipe(select(panelCompSelector))
      .subscribe((component: string) => {
        this.createChildComponent(component)
      })
  }

  createChildComponent(c: string): void {
    if (c && this.activeChild !== c && Components[c]) {
      if (this.childComponent) {
        this.childComponent.destroy()
      }

      const componentFactory = this.resolver.resolveComponentFactory(
        Components[c]
      )
      this.entry.clear()
      this.childComponent = this.entry.createComponent(componentFactory)
    }
    this.activeChild = c
  }
}
