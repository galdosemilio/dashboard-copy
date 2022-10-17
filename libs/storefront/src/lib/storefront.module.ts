import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { RouterModule } from '@angular/router'
import { NgxStripeModule } from 'ngx-stripe'

import { MomentModule } from 'ngx-moment'
import { TranslateModule } from '@ngx-translate/core'
import { CoachcareSdkModule } from '@coachcare/common'

import { NgxGalleryModule } from '@kolkov/ngx-gallery'

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'

import { StorefrontComponents, StorefrontProviders } from './storefront.barrel'
import { StorefrontRoutingModule } from './storefront.routing'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CcrFormFieldsModule } from '@coachcare/common/components'
import { MatInputModule } from '@angular/material/input'
import { environment } from './environments/environment'
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  imports: [
    CommonModule,
    CoachcareSdkModule,
    FlexLayoutModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatToolbarModule,
    MatExpansionModule,
    MatBadgeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatToolbarModule,
    ReactiveFormsModule,
    CcrFormFieldsModule,
    FormsModule,
    RouterModule,
    MomentModule,
    NgxGalleryModule,
    NgxStripeModule.forRoot(environment.stripeKey),
    StorefrontRoutingModule,
    TranslateModule.forChild()
  ],
  exports: StorefrontComponents,
  declarations: StorefrontComponents,
  providers: StorefrontProviders
})
export class StorefrontModule {}
