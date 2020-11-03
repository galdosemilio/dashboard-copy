import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDescriptionComponent } from './description.component';

describe('ReportDescriptionComponent', () => {
  let component: ReportDescriptionComponent;
  let fixture: ComponentFixture<ReportDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDescriptionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
