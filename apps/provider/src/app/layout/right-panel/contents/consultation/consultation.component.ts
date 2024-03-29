import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'

import { EventsService } from '@app/service'

import { ConsultationFormArgs } from './consultationFormArgs.interface'

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html'
})
export class ConsultationComponent implements OnInit, OnDestroy {
  formType = 'addConsultation'
  editing = false
  addNewMeetingZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020575472-Adding-a-New-Meeting-in-the-Dashboard'
  showUnavailablity = true

  constructor(private cdr: ChangeDetectorRef, private bus: EventsService) {}

  ngOnInit() {
    // listen any events emitted to this component
    this.bus.register('right-panel.consultation.form', this.setForm.bind(this))
    this.bus.register(
      'right-panel.consultation.editing',
      this.setEditing.bind(this)
    )
    this.bus.register(
      'right-panel.consultation.display.set-as-unavailable',
      this.displayUnavailability.bind(this)
    )
  }

  ngOnDestroy() {
    this.bus.unregister('right-panel.consultation.form')
    this.bus.unregister('right-panel.consultation.editing')
  }

  setEditing(value: boolean) {
    this.editing = value
    this.formType = 'addConsultation'
  }

  setForm(args: ConsultationFormArgs): void {
    this.formType = args.form
    this.cdr.detectChanges()
    this.bus.trigger('right-panel.consultation.meeting', args)
  }

  displayUnavailability(value: boolean): void {
    this.showUnavailablity = value
  }
}
