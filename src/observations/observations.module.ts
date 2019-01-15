import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationsPage } from './observations';
//import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    ObservationsPage,
  ],
  imports: [
    //ComponentsModule,
    IonicPageModule.forChild(ObservationsPage)
  ],
  exports: [
    ObservationsPage
  ]
})
export class ObservationsPageModule {}
