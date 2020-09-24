import { inject, TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { TestModule } from './shared/index.test';

describe('ApiService', () => {
  // inject doesn't work with beforeAll
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule(TestModule());
  });

  it(
    'injected',
    inject([ApiService], (service: ApiService) => {
      expect(service).toBeTruthy();
    })
  );
});
