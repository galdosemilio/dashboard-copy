import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@coachcare/common/material';
import { MatIconModule } from '@coachcare/common/material';
import { MatMenuModule } from '@coachcare/common/material';
import { CcrPipesModule } from '@coachcare/common/pipes';
import {
  AuthService,
  ConfigService,
  CookieService,
  EventsService,
  LanguageService,
  LayoutService,
} from '@coachcare/common/services';
import { APP_CONFIG, APP_ENVIRONMENT } from '@coachcare/common/shared';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService, User } from 'selvera-api';
import { ApiFactory, UserFactory } from '../../../services/api.services';
import { environment, projectConfig } from '../../../tests/index';
import { TopbarComponent } from './topbar.component';

class MockAuthService {
  check() {
    return true;
  }
}

@Component({
  selector: 'ccr-search',
  template: '',
})
class MockSearchComponent {
  @Input() fill: string;
}

@Component({
  selector: 'ccr-icon-user',
  template: '',
})
class MockIconUserComponent {
  @Input() fill: string;
}

describe('Layout.TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        TranslateModule.forRoot(),
        CcrPipesModule,
      ],
      declarations: [
        TopbarComponent,
        MockSearchComponent,
        MockIconUserComponent,
      ],
      providers: [
        {
          provide: APP_ENVIRONMENT,
          useValue: environment,
        },
        {
          provide: APP_CONFIG,
          useValue: projectConfig,
        },
        {
          provide: ApiService,
          useFactory: ApiFactory,
          deps: [APP_ENVIRONMENT],
        },
        {
          provide: User,
          useFactory: UserFactory,
          deps: [ApiService],
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        CookieService,
        ConfigService,
        EventsService,
        LanguageService,
        LayoutService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
