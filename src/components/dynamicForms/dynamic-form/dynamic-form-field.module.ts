import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DynamicFormFieldComponent } from './dynamic-form-field.component'
import {DynFormComponentModule} from './popoverAutocompPage.module'

@NgModule({
  declarations: [
    DynamicFormFieldComponent,
  ],
  imports: [
    DynFormComponentModule,
    IonicPageModule.forChild(DynamicFormFieldComponent),
  ],
  exports: [
    DynamicFormFieldComponent
  ]
})
export class DynamicFormFieldComponentModule {}
