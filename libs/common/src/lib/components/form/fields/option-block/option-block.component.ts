import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface BlockOption {
  androidAppLink?: string;
  description?: string;
  displayValue: string;
  index?: number;
  iosAppLink?: string;
  subtext?: string;
  value: string;
}

@Component({
  selector: 'ccr-form-field-block',
  templateUrl: './option-block.component.html',
  styleUrls: ['./option-block.component.scss']
})
export class OptionBlockFieldComponent implements OnInit {
  @Input() options: BlockOption[] = [];

  @Output() selectionChange: EventEmitter<BlockOption> = new EventEmitter<BlockOption>();

  public androidButtonLink: string;
  public iosButtonLink: string;
  public selectedOption: BlockOption;

  constructor(private translate: TranslateService) {}

  public ngOnInit(): void {
    if (!this.options.length) {
      return;
    }

    this.resolveBadgeLinks(this.translate.currentLang.split('-')[0].toLowerCase());
  }

  public onOptionSelect(option: BlockOption): void {
    this.selectedOption = option;
    this.selectionChange.emit(this.selectedOption);
  }

  private resolveBadgeLinks(lang: string) {
    this.androidButtonLink = `/assets/badges/${lang}-play-store-badge.png`;
    this.iosButtonLink = `/assets/badges/${lang}-app-store-badge.png`;
  }
}
