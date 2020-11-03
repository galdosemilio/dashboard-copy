import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallVideoRequestComponent } from './video-request.component';

describe('CallVideoRequestComponent', () => {
  let component: CallVideoRequestComponent;
  let fixture: ComponentFixture<CallVideoRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallVideoRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallVideoRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
