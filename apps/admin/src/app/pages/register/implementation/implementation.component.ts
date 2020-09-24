import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '@coachcare/common/services';
import { Translations } from './contents';

@Component({
  selector: 'ccr-page-register-implementation',
  templateUrl: './implementation.component.html',
  styleUrls: ['./implementation.component.scss'],
  host: {
    class: 'ccr-page-content'
  }
})
export class RegisterImplementationPageComponent implements OnInit {
  @ViewChild('langTemplate', { read: ViewContainerRef, static: true })
  langTemplate: ViewContainerRef;

  constructor(
    private resolver: ComponentFactoryResolver,
    private translator: TranslateService,
    private language: LanguageService
  ) {}

  ngOnInit() {
    this.createContent();
    this.translator.onLangChange.subscribe(() => this.createContent());
  }

  createContent() {
    const locale = this.language.resolve(Object.keys(Translations));
    const component = Translations[locale];

    const componentFactory = this.resolver.resolveComponentFactory(component);

    this.langTemplate.clear();
    this.langTemplate.createComponent(componentFactory);
  }
}
