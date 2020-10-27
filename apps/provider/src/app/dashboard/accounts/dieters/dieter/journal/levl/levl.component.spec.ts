import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevlComponent } from './levl.component';

describe('LevlComponent', () => {
  let component: LevlComponent;
  let fixture: ComponentFixture<LevlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LevlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
