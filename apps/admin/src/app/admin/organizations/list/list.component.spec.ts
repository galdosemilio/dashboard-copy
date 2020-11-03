import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationsListComponent } from './list.component';

describe('OrganizationsListComponent', () => {
  let component: OrganizationsListComponent;
  let fixture: ComponentFixture<OrganizationsListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [OrganizationsListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a list of organizations', done => {
    // TODO implement test
    done();
  });

  it('should fetch a list of organizations on search', done => {
    // TODO implement test
    done();
  });
});
