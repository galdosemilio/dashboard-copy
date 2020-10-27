import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietersTableComponent } from './table.component';

describe('DietersTableComponent', () => {
  let component: DietersTableComponent;
  let fixture: ComponentFixture<DietersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DietersTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
