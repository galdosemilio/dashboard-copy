import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicsPickerComponent } from './picker.component';

describe('ClinicsPickerComponent', () => {
  let component: ClinicsPickerComponent;
  let fixture: ComponentFixture<ClinicsPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicsPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
