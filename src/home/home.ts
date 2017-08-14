import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ProtocolsPage} from '../protocols/protocols';
import { ProjectsPage } from '../projects/projects';
import { LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  protocolsPage : any;
  projectsPage : any;
  loginPage : any;

  constructor(public navCtrl: NavController) {
    this.protocolsPage = ProtocolsPage;
    this.projectsPage = ProjectsPage ;
    this.loginPage = LoginPage;
  }
    homePage(){
      this.navCtrl.push(ProjectsPage)
  }


}
  