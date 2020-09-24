import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PlanSelectorSelectionEvent } from '../components';

@Component({
  selector: 'ccr-register-clinic-default-clinic-packages',
  templateUrl: './default-clinic-packages.component.html',
  styleUrls: ['./default-clinic-packages.component.scss']
})
export class DefaultClinicPackageComponent {
  @Input() formGroup: FormGroup;

  @Output() nextStep = new EventEmitter();
  @Output()
  selected: EventEmitter<PlanSelectorSelectionEvent> = new EventEmitter<
    PlanSelectorSelectionEvent
  >();

  public clinicPlanSelection: PlanSelectorSelectionEvent;

  constructor(private cdr: ChangeDetectorRef) {}

  public onClinicPlanSelect($event: PlanSelectorSelectionEvent): void {
    this.clinicPlanSelection = $event;
    this.formGroup.patchValue({
      type: $event.plan ? $event.plan.type : '',
      billingPeriod: $event.billing ? $event.billing.billingPeriod : ''
    });
    this.selected.emit(this.clinicPlanSelection);
    this.cdr.detectChanges();
  }

  public onSubmit(): void {
    this.nextStep.emit();
  }
}
