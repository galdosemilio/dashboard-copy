import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesTableComponent } from './table.component';

describe('LabelsTableComponent', () => {
  let component: DevicesTableComponent;
  let fixture: ComponentFixture<DevicesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DevicesTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
