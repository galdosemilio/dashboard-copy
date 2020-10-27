import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallHeaderControlsComponent } from './header-controls.component';

describe('HeaderControlsComponent', () => {
  let component: CallHeaderControlsComponent;
  let fixture: ComponentFixture<CallHeaderControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallHeaderControlsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallHeaderControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
