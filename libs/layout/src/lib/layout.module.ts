import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { LayoutStoreModule } from '@coachcare/layout/store'
import { BoardLayoutModule } from './board/board-layout.module'
import { PlainLayoutModule } from './plain/plain-layout.module'

@NgModule({
  imports: [
    CommonModule,
    BoardLayoutModule,
    PlainLayoutModule,
    LayoutStoreModule.forParent()
  ],
  exports: [BoardLayoutModule, PlainLayoutModule]
})
export class LayoutModule {}
