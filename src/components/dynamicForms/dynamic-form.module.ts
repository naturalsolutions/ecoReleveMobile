import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DynamicFormComponent } from './dynamic-form.component'
import {DynamicFormFieldComponentModule} from './dynamic-form/dynamic-form-field.module'
import {MapComponentModule } from '../map/map.module'

@NgModule({
  declarations: [
    DynamicFormComponent,
  ],
  imports: [
    DynamicFormFieldComponentModule,
    MapComponentModule,
    IonicPageModule.forChild(DynamicFormComponent),
  ],
  exports: [
    DynamicFormComponent
  ]
})
export class DynFormComponentModule {}
