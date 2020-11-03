import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieterMeasurementsComponent } from './measurements.component';

describe('DieterMeasurementsComponent', () => {
  let component: DieterMeasurementsComponent;
  let fixture: ComponentFixture<DieterMeasurementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterMeasurementsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
