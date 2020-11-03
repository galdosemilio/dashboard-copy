import { Component, Input, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { MenuItem } from '@coachcare/common/shared';

@Component({
  selector: 'ccr-menuitem',
  templateUrl: './menuitem.component.html'
})
export class MenuItemComponent implements OnChanges {
  @ViewChildren(MenuItemComponent) children: QueryList<MenuItemComponent>;
  @Input() menuItem: MenuItem;
  @Input() level = 1;
  @Input() parent: MenuItemComponent;
  @Input() isMenuOpened = false;

  active: any = false;
  _this: MenuItemComponent = this;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.active = this.menuItem.expanded;
  }

  get height(): number {
    let addedHeight = 0;
    if (this.children) {
      this.children.forEach(childComponent => {
        if (childComponent.active) {
          addedHeight += childComponent.height;
        }
      });
    }
    return this.menuItem.children ? this.menuItem.children.length * 36 + addedHeight : 0;
  }

  get levelClass(): string {
    return `level${this.level}`;
  }

  get hasChildren(): boolean {
    if (!this.menuItem || !this.menuItem.children) {
      return false;
    }
    return this.menuItem.children.length > 0;
  }

  toggleDropdown(active: boolean): void {
    this.menuItem.expanded = active;
    this.active = active;
  }

  clicked(event: MouseEvent): void {
    this.toggleDropdown(!this.active);
  }

  openLink(link: string) {
    window.open(link, '_self');
  }

  newWindow(link: string) {
    window.open(link, '_blank');
  }
}
