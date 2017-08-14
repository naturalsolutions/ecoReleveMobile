import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ProtocolFormComponent } from './protocol-form';

@NgModule({
  declarations: [
    ProtocolFormComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ProtocolFormComponent
  ]
})
export class ProtocolFormComponentModule {}
