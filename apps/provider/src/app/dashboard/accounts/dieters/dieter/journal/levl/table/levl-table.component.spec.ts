import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevlTableComponent } from './levl-table.component';

describe('LevlTableComponent', () => {
  let component: LevlTableComponent;
  let fixture: ComponentFixture<LevlTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LevlTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevlTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
