import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LibraryFormsModule } from '@app/dashboard/library/forms/forms.module'
import { SharedModule } from '@app/shared/shared.module'
import { Components, Providers, RightPanelComponent } from './'

@NgModule({
  imports: [CommonModule, SharedModule, LibraryFormsModule],
  exports: [RightPanelComponent],
  declarations: Components,
  providers: [...Providers]
})
export class RightPanelModule {}
