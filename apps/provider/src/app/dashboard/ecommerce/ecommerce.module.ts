import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { SharedModule } from '@app/shared/shared.module'
import { EcommerceRoutes } from './ecommerce.routing'
import { EcommerceComponents } from './index'

@NgModule({
  imports: [CommonModule, RouterModule.forChild(EcommerceRoutes), SharedModule],
  declarations: EcommerceComponents,
  exports: EcommerceComponents,
  providers: []
})
export class EcommerceModule {}
