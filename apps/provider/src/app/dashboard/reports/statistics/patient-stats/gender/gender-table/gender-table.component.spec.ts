import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderTableComponent } from './gender-table.component';

describe('GenderTableComponent', () => {
  let component: GenderTableComponent;
  let fixture: ComponentFixture<GenderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenderTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
