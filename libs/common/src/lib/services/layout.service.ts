import { Injectable } from '@angular/core';
import { AppBreakpoints } from '@coachcare/common/shared';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';
import { EventsService } from './events.service';

/**
 * Layout Service
 */
@Injectable()
export class LayoutService {
  config: AppBreakpoints;

  /**
   * Layout Size Indicator
   */
  size = new BehaviorSubject<string>('');

  /**
   * State Handlers
   */
  menuState = new BehaviorSubject<boolean>(false);
  panelState = new BehaviorSubject<boolean>(false);
  isPanelEnabled = new BehaviorSubject<boolean>(false);
  onPanelComponentChange = new BehaviorSubject<string>('');

  /**
   * Grid Handling
   */
  circleCols = new BehaviorSubject<number>(4);
  colSpan = new BehaviorSubject<number>(2);
  rowSpan = new BehaviorSubject<boolean>(false);

  constructor(config: ConfigService, private bus: EventsService) {
    this.config = config.get('app.screen');
    this.initialState(window.innerWidth);
    this.bus.register('right-panel.component.set', this.setPanelComponent.bind(this));
    this.bus.register('right-panel.deactivate', this.deactivatePanel.bind(this));
  }

  /**
   * Sidenav Handling
   */
  set IsMenuOpen(v: boolean) {
    this.menuState.next(v);
  }
  get IsMenuOpen(): boolean {
    return this.menuState.getValue();
  }

  toggleMenu(): void {
    this.menuState.next(!this.IsMenuOpen);
  }
  openMenu(): void {
    if (!this.IsMenuOpen) {
      this.IsMenuOpen = true;
    }
  }
  closeMenu(): void {
    if (this.IsMenuOpen) {
      this.IsMenuOpen = false;
    }
  }

  /**
   * Right Panel Handling
   */
  set IsPanelOpen(v: boolean) {
    this.panelState.next(v);
  }
  get IsPanelOpen(): boolean {
    return this.panelState.getValue();
  }

  togglePanel(): void {
    this.panelState.next(!this.IsPanelOpen);
  }
  openPanel(): void {
    if (!this.IsPanelOpen && this.panelEnabled) {
      this.IsPanelOpen = true;
    }
  }
  closePanel(): void {
    if (this.IsPanelOpen) {
      this.IsPanelOpen = false;
    }
  }

  /**
   * Right Panel Activation
   */
  set panelEnabled(v: boolean) {
    this.isPanelEnabled.next(v);
  }
  get panelEnabled(): boolean {
    return this.isPanelEnabled.getValue();
  }

  activatePanel(): void {
    if (!this.panelEnabled) {
      this.panelEnabled = true;
    }
  }
  deactivatePanel(): void {
    if (this.panelEnabled) {
      this.panelEnabled = false;
    }
  }
  togglePanelActivation(): void {
    this.isPanelEnabled.next(!this.panelEnabled);
  }

  /**
   *  Setting relevant component in the right-panel
   */
  setPanelComponent(c: string): void {
    if (!this.panelEnabled) {
      this.activatePanel();
    }
    if (this.onPanelComponentChange.getValue() !== c) {
      this.onPanelComponentChange.next(c);
    }
  }

  /**
   * Layout Size Control
   */
  updateSize(width: number) {
    if (width <= this.config.xs) {
      this.size.next('xs');
    } else if (width <= this.config.sm) {
      this.size.next('sm');
    } else if (width <= this.config.md) {
      this.size.next('md');
    } else if (width <= this.config.lg) {
      this.size.next('lg');
    } else {
      this.size.next('xl');
    }
  }

  /**
   * Initial State Values
   */
  initialState(width: number) {
    this.updateSize(width);
    // sync the initial CSS with the variables
    this.menuState.next(width < this.config.md ? false : true);
    this.panelState.next(width < this.config.lg ? false : true);
    this.circleCols.next(width < this.config.md ? 2 : 4);
    this.colSpan.next(width < this.config.md ? 1 : 2);
    this.rowSpan.next(width < this.config.xs ? true : false);
  }

  /**
   * Resize Event Handlers
   */
  resize(e: any): void {
    this.evalWidth(e.target.innerWidth);
  }

  evalWidth(width: number) {
    this.updateSize(width);
    // if innerwidth goes to 992 and the sidenav is open then close it
    if (width < this.config.md && this.IsMenuOpen) {
      this.closeMenu();
    }
    if (width < this.config.lg && this.IsPanelOpen) {
      this.closePanel();
    } else if (width > this.config.lg && !this.IsPanelOpen) {
      this.openPanel();
    }
    // circle grid setting
    this.circleCols.next(width < this.config.md ? 2 : 4);
    // colSpan and rowSpan settings
    this.colSpan.next(width < this.config.md ? 1 : 2);
    this.rowSpan.next(width < this.config.xs ? true : false);
  }
}
