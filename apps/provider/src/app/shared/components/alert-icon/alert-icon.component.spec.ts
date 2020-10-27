import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertIconComponent } from './alert-icon.component';

describe('AlertIconComponent', () => {
  let component: AlertIconComponent;
  let fixture: ComponentFixture<AlertIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlertIconComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
