import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleAvailabilitySingleDayComponent } from './single-day.component';

describe('ScheduleAvailabilitySingleDayComponent', () => {
  let component: ScheduleAvailabilitySingleDayComponent;
  let fixture: ComponentFixture<ScheduleAvailabilitySingleDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleAvailabilitySingleDayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleAvailabilitySingleDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
