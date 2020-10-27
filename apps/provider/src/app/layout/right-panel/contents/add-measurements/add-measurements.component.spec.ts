import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMeasurementsComponent } from './add-measurements.component';

describe('MeasurementsComponent', () => {
  let component: AddMeasurementsComponent;
  let fixture: ComponentFixture<AddMeasurementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddMeasurementsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
