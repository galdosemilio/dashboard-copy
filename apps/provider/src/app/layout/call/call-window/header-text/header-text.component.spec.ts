import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallHeaderTextComponent } from './header-text.component';

describe('HeaderTextComponent', () => {
  let component: CallHeaderTextComponent;
  let fixture: ComponentFixture<CallHeaderTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallHeaderTextComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallHeaderTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
