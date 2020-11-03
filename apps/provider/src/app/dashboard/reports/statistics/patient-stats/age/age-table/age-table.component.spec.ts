import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeTableComponent } from './age-table.component';

describe('AgeTableComponent', () => {
  let component: AgeTableComponent;
  let fixture: ComponentFixture<AgeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgeTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
