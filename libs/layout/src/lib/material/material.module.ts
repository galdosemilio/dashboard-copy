import { NgModule } from '@angular/core';
import { CcrMaterialModules } from '.';

@NgModule({
  imports: [...CcrMaterialModules],
  exports: [...CcrMaterialModules]
})
export class CcrMaterialModule {}
