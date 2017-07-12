import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HerpetofaunePage } from './herpetofaune';

@NgModule({
  declarations: [
    HerpetofaunePage,
  ],
  imports: [
    IonicPageModule.forChild(HerpetofaunePage),
  ],
  exports: [
    HerpetofaunePage
  ]
})
export class AvifaunePagePageModule {}
