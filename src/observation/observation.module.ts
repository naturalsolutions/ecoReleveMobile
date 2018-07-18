import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationPage } from './observation';
import { AdDirective }    from '../shared/ad.directive';

@NgModule({
  declarations: [
    ObservationPage,
    AdDirective
  ],
  imports: [
    IonicPageModule.forChild(ObservationPage),
  ],
  exports: [
    ObservationPage
  ]
})
export class ObservationPageModule {}
