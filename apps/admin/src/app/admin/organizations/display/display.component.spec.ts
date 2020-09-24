import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsDisplayComponent } from './display.component';

describe('OrganizationsDisplayComponent', () => {
  let component: OrganizationsDisplayComponent;
  let fixture: ComponentFixture<OrganizationsDisplayComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrganizationsDisplayComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
