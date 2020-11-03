import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieterDashboardComponent } from './dashboard.component';

describe('DieterDashboardComponent', () => {
  let component: DieterDashboardComponent;
  let fixture: ComponentFixture<DieterDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterDashboardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
