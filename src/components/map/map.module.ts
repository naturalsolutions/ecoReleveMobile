import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapComponent } from './map';

@NgModule({
  declarations: [
    MapComponent,
  ],
  imports: [
    IonicPageModule.forChild(MapComponent),
  ],
  exports: [
    MapComponent
  ]
})
export class MapComponentModule {}
