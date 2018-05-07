import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,Platform ,LoadingController} from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Network } from '@ionic-native/network'
import { ProjectsPage } from '../projects/projects';
import {AuthService} from "../providers/auth";
import 'rxjs/add/operator/map';
import { errorHandler } from '@angular/platform-browser/src/browser';
import {Storage} from "@ionic/storage";



@IonicPage({
  name : 'login',
  segment : 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

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
        if(error.status == 401){
            alert('401');
        }
        this.alertError();

      }
    }, error=> {
      if(error.status == 401){
        alert('401');
      }
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
  resetLogout(){
    this.navCtrl.setRoot(ProjectsPage);
  }
}
