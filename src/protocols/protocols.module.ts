import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProtocolsPage } from './protocols';

@NgModule({
  declarations: [
    ProtocolsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProtocolsPage),
  ],
  exports: [
    ProtocolsPage
  ]
})
export class ProtocolsPageModule {}
