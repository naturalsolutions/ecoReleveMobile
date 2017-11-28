import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage2 } from './login2';

@NgModule({
  declarations: [
    LoginPage2,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage2),
  ],
  exports: [
    LoginPage2
  ]
})
export class LoginPageModule {}
