import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAvailabilityRecurringComponent } from './recurring.component';

describe('ScheduleAvailabilityRecurringComponent', () => {
  let component: ScheduleAvailabilityRecurringComponent;
  let fixture: ComponentFixture<ScheduleAvailabilityRecurringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleAvailabilityRecurringComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleAvailabilityRecurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
