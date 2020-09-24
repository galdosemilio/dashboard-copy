import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsTreeComponent } from './tree.component';

describe('OrganizationsTreeComponent', () => {
  let component: OrganizationsTreeComponent;
  let fixture: ComponentFixture<OrganizationsTreeComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrganizationsTreeComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
