import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientActivityComponent } from './patient-activity.component';

describe('PatientActivityComponent', () => {
  let component: PatientActivityComponent;
  let fixture: ComponentFixture<PatientActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientActivityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
