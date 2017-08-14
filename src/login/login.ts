import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ProjectsPage } from '../projects/projects';

@IonicPage({
  name : 'login',
  segment : 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public formModel: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private  builder: FormBuilder
  ) {
  }

  ionViewDidLoad() {
    this.formModel = this.builder.group({
        'login': [
          //'', // default value
          //[Validators.required]
        ],
        'password': [
          // '',
          //[Validators.required]
        ]
    });
  }

  onSubmit(value) {
    this.navCtrl.push(ProjectsPage)
  }

}
