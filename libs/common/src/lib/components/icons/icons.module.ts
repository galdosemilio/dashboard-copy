import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { UserIconComponent } from './user-icon/user-icon.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SearchIconComponent, UserIconComponent],
  exports: [SearchIconComponent, UserIconComponent]
})
export class CcrIconsComponentsModule {}
