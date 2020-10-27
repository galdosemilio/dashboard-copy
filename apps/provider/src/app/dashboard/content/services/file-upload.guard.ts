import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { LibraryComponent } from '@app/dashboard/library';

@Injectable()
export class FileUploadGuard implements CanDeactivate<LibraryComponent> {
  async canDeactivate(component: LibraryComponent) {
    return component.canDeactivate();
  }
}
