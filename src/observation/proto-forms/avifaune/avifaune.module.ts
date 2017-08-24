import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvifauneComponent } from './avifaune';

@NgModule({
  declarations: [
    AvifauneComponent,
  ],
  imports: [
    IonicPageModule.forChild(AvifauneComponent),
  ],
  exports: [
    AvifauneComponent
  ]
})
export class AvifaunePagePageModule {}
