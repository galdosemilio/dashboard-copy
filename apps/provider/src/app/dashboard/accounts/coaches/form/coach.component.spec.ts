import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachFormComponent } from './coach.component';

describe('CoachFormComponent', () => {
  let component: CoachFormComponent;
  let fixture: ComponentFixture<CoachFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoachFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
