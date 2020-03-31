import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcrSelveraApiModule } from './npm-api';

@NgModule({
  imports: [CommonModule, CcrSelveraApiModule]
})
export class BackendModule {}
