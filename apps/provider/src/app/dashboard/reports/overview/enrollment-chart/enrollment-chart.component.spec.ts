import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentChartComponent } from './enrollment-chart.component';

describe('ChartComponent', () => {
  let component: EnrollmentChartComponent;
  let fixture: ComponentFixture<EnrollmentChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrollmentChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
