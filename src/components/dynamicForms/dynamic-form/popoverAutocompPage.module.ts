import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverAutocompPage } from './popoverAutocompPage'


@NgModule({
  declarations: [
    PopoverAutocompPage,
  ],
  imports: [
    
    IonicPageModule.forChild(PopoverAutocompPage),
  ],
  exports: [
    PopoverAutocompPage
  ]
})
export class DynFormComponentModule {}
