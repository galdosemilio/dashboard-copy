import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachesTableComponent } from './table.component';

describe('CoachesTableComponent', () => {
  let component: CoachesTableComponent;
  let fixture: ComponentFixture<CoachesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoachesTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
