import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupsChartComponent } from './signups-chart.component';

describe('ChartComponent', () => {
  let component: SignupsChartComponent;
  let fixture: ComponentFixture<SignupsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupsChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
