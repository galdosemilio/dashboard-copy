import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsTableComponent } from './table.component';

describe('AlertsTableComponent', () => {
  let component: AlertsTableComponent;
  let fixture: ComponentFixture<AlertsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertsTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
