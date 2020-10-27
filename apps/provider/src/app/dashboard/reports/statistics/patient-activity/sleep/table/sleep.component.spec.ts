import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepTableComponent } from './sleep.component';

describe('SleepTableComponent', () => {
  let component: SleepTableComponent;
  let fixture: ComponentFixture<SleepTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SleepTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SleepTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
