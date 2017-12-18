import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Platform ,LoadingController} from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Network } from '@ionic-native/network'
import { ProjectsPage } from '../projects/projects';
//import {Headers, Http, RequestOptions} from "@angular/http";
//import {JwtHelper} from "angular2-jwt";
//import {Storage} from "@ionic/storage";
import {AuthService} from "../providers/auth";
//import {JsSHA} from "../../node_modules/jssha"
//import * as JsSHA from 'jssha';
import 'rxjs/add/operator/map';
import { errorHandler } from '@angular/platform-browser/src/browser';
import {Storage} from "@ionic/storage";



@IonicPage({
  name : 'login2',
  segment : 'login2'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login2.html',
 // providers : [AuthService
  //]
})
export class LoginPage2 {

  public formModel: FormGroup;
  connectionStatus : any
  loading : any

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private  builder: FormBuilder,
    // added to auth
    private storage: Storage,
    private alertCtrl: AlertController,
    private auth: AuthService,
    public platform :Platform,
    private network :Network,
    public loadingCtrl: LoadingController
  ) {

    
  }

  /*ionViewDidLoad() {
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
  }*/

  /*onSubmit(value) {
    this.navCtrl.push(ProjectsPage)
  }*/
  // added to implement login

//**********************************

  authenticate(credentials) {
    
    if (this.platform.is('cordova')) {
      this.connectionStatus = this.network.type == 'none' ? 'offline' : 'online';
      if(this.connectionStatus == 'offline') {
        this.alertError();
        return;
      }
    }
    this.loading = this.loadingCtrl.create({
      content: 'Authentification en cours...',
      spinner: 'bubbles'
    });

    this.auth.checkuser(credentials).then(data =>{
      this.auth.login(data).then(data=>{
        this.loading.dismiss();
        this.navCtrl.setRoot(ProjectsPage);
      }), error=> {
        this.alertError();

      }
    }, error=> {
      this.alertError();

    }
  );

  }
  alertError(){
    let alert = this.alertCtrl.create({
      title: "Erreur d'authentification",
      message: "L'authentification' a échoué. Merci de vérifier votre connexion internet ou de contacter l'administrateur.",
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
    alert.present();
    this.loading.dismiss();
  }
  logout() {
    this.storage.remove('token');
    this.auth.isLoggedin = false;
  }
}
