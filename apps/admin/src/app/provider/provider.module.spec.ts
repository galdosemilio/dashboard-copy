import { AppProviderModule } from './provider.module';

describe('AppProviderModule', () => {
  let providerModule: AppProviderModule;

  beforeEach(() => {
    providerModule = new AppProviderModule();
  });

  it('should create an instance', () => {
    expect(providerModule).toBeTruthy();
  });
});
