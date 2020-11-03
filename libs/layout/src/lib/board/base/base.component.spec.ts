import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@coachcare/common/material';
import { MatToolbarModule } from '@coachcare/common/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ConfigService,
  EventsService,
  LayoutService,
} from '@coachcare/common/services';
import { APP_CONFIG } from '@coachcare/common/shared';
import { projectConfig } from '@coachcare/common/tests';
import { TranslateModule } from '@ngx-translate/core';
import { BaseComponent } from './base.component';

@Component({
  selector: 'ccr-menu',
  template: '',
})
class MockMenuComponent {
  @Input() isOpened = false;
}

@Component({
  selector: 'ccr-topbar',
  template: '',
})
class MockTopbarComponent {
  @Input() translations: any = {};
  @Input() selectedLanguage: string;
  @Input() panelEnabled: boolean;
}

@Component({
  selector: 'ccr-footer',
  template: '',
})
class MockFooterComponent {}

describe('Layout.BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterTestingModule,
        TranslateModule.forChild(),
      ],
      declarations: [
        MockFooterComponent,
        MockMenuComponent,
        MockTopbarComponent,
        BaseComponent,
      ],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: projectConfig,
        },
        ConfigService,
        EventsService,
        LayoutService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
