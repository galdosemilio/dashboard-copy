import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DieterProfileComponent } from './profile.component';

describe('DieterProfileComponent', () => {
  let component: DieterProfileComponent;
  let fixture: ComponentFixture<DieterProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DieterProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DieterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
