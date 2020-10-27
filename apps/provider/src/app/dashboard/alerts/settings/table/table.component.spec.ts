import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTypesTableComponent } from './table.component';

describe('AlertsTableComponent', () => {
  let component: AlertTypesTableComponent;
  let fixture: ComponentFixture<AlertTypesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertTypesTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTypesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
