import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvifaunePage } from './avifaune';

@NgModule({
  declarations: [
    AvifaunePage,
  ],
  imports: [
    IonicPageModule.forChild(AvifaunePage),
  ],
  exports: [
    AvifaunePage
  ]
})
export class AvifaunePagePageModule {}
