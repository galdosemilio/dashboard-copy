import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsSettingsComponent } from './form.component';

describe('OrganizationsSettingsComponent', () => {
  let component: OrganizationsSettingsComponent;
  let fixture: ComponentFixture<OrganizationsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationsSettingsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
