import { Inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@coachcare/common/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CCR_CONFIG, CCRConfig, IconsConfig } from '@app/config';
import { configSelector, InitConfig, UpdateConfig } from '@app/store/config';
import { select, Store } from '@ngrx/store';
import { get, set } from 'lodash';

@Injectable()
export class ConfigService {
  /**
   * Config Values
   */
  config: CCRConfig;

  constructor(
    @Inject(CCR_CONFIG) config: CCRConfig,
    private store: Store<CCRConfig>,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.store.pipe(select(configSelector)).subscribe((conf: CCRConfig) => {
      this.config = conf;
    });
    IconsConfig.registerIcons(this.iconRegistry, this.sanitizer);
    this.store.dispatch(new InitConfig(config));
  }

  get(path: string, defaultValue: any = {}): any {
    return get(this.config, path, defaultValue);
  }

  set(path: string, value: any): void {
    this.store.dispatch(new UpdateConfig(set(this.config, path, value)));
  }
}
