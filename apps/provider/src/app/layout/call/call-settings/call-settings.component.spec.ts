import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallSettingsComponent } from './call-settings.component';

describe('CallSettingsComponent', () => {
  let component: CallSettingsComponent;
  let fixture: ComponentFixture<CallSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallSettingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
