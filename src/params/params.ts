import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProjectsPage } from '../projects/projects';
import {Storage} from "@ionic/storage";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-params',
  templateUrl: 'params.html',
})
export class ParamsPage {
  serverUrl : any
  serverForm : any
  //editUrl : any = true

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private formBuilder: FormBuilder,
    ) {
     /* this.storage.get('serverUrl').then((data)=>{
        this.serverUrl = data;
        this.serverForm = this.formBuilder.group({
          'url': [this.serverUrl, Validators.compose([
            Validators.required
          ])],
        });

      });*/

      

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParamsPage');

  }

  updateUrl(){


  }
  reset(){
    this.navCtrl.setRoot(ProjectsPage);
  }
}
