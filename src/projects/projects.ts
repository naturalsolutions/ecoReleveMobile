import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ProjectsServiceProvider} from '../providers/projects-service';
import { ProtocolsPage } from '../protocols/protocols';

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
    providers : [ProjectsServiceProvider]
})
export class ProjectsPage {

  projects : any;
  checkproj :any;
  projectsSegment: string= 'myproj';
  disabled:any = 'disabled';

  constructor(public navCtrl: NavController, public navParams: NavParams, public projectsService : ProjectsServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
    this.loadProjects();
  }

  loadProjects (){
    console.log('in loadProjects');
    this.projectsService.load()
    .then(data =>{
      console.log('in then load projects');
      this.projects = data;
    })

  }
    navToProtocols(){
    // get selected protocol
    //let pro = this.protocols.find(x => x.id === id);

    this.navCtrl.push(ProtocolsPage);
  }
  checkedDone(proj) {
    if(proj.checked){
      this.disabled = false;
    } else {
      this.disabled = "disabled";

      for (let proj of this.projects) {
        if(proj.checked) {
          this.disabled = false;
        }
      }
    }

  }
  ImportProjects(){
    alert('à importer');
  }

}
