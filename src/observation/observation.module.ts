import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationPage } from './observation';
import { AdDirective }    from '../shared/ad.directive';
import {DynFormComponentModule } from '../components/dynamicForms/dynamic-form.module'

@NgModule({
  declarations: [
    ObservationPage,
    AdDirective
  ],
  imports: [
    DynFormComponentModule,
    IonicPageModule.forChild(ObservationPage),
  ],
  exports: [
    ObservationPage
  ]
})
export class ObservationPageModule {}
