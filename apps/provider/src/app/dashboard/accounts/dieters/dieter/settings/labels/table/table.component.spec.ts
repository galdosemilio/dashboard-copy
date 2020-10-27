import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsTableComponent } from './table.component';

describe('LabelsTableComponent', () => {
  let component: LabelsTableComponent;
  let fixture: ComponentFixture<LabelsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
