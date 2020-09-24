import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigService } from '@coachcare/common/services';
import { APP_CONFIG } from '@coachcare/common/shared';
import { TranslateModule } from '@ngx-translate/core';
import { projectConfig } from '../../../tests/index';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  @Component({
    selector: 'ccr-layout-base',
    template: ''
  })
  class MockLayoutBaseComponent {
    @Input() isMenuOpened: boolean;
    @Input() isPanelOpened: boolean;
    @Input() isPanelEnabled: boolean;
    @Input() lang: string;
    @Input() translations: any;
  }

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, TranslateModule.forRoot()],
        declarations: [FooterComponent, MockLayoutBaseComponent],
        providers: [
          {
            provide: APP_CONFIG,
            useValue: projectConfig
          },
          ConfigService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
