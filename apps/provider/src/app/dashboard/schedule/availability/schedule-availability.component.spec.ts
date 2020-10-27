import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAvailabilityComponent } from './schedule-availability.component';

describe('ScheduleAvailabilityComponent', () => {
  let component: ScheduleAvailabilityComponent;
  let fixture: ComponentFixture<ScheduleAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleAvailabilityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
