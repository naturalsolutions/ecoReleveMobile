import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MammofaunePage } from './mammofaune';

@NgModule({
  declarations: [
    MammofaunePage,
  ],
  imports: [
    IonicPageModule.forChild(MammofaunePage),
  ],
  exports: [
    MammofaunePage
  ]
})
export class MammofaunePagePageModule {}
