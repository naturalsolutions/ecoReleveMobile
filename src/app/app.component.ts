import { Component, ViewChild, HostBinding,Renderer } from '@angular/core';
import { Nav, Platform,LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { ProjectsPage } from '../projects/projects';
import { LoginPage} from '../login/login';
import {AuthService} from "../providers/auth";
import { SQLite } from '@ionic-native/sqlite';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private networkStatus: string;

  @HostBinding('class.error-network') get isErrorNetwork() {
    return this.networkStatus == 'hasErrorNetwork'
  }

  rootPage: any;
  loading : any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              public storage: Storage,
              private auth: AuthService,
              private sqlite : SQLite,
              public loadingCtrl: LoadingController
              ) {
    this.initializeApp();

    this.pages = [
      { title: 'Projets', component: ProjectsPage},
      { title: 'Déconnexion', component: LoginPage},
    ];

  }
  initAllDatabases(dataBasesNameArray) {

    return new Promise( (resolve, reject) => {
      for(var i =0 ; i < dataBasesNameArray.length ; i++ ) {
        this.initDb(dataBasesNameArray[i]);
      }
      resolve();
    });
    
  }

  initDb(dataBaseName) {
    var _this = this;
 
    if ((<any>window).sqlitePlugin) {
      (<any>window).plugins.sqlDB.copy(dataBaseName,'default', function () {
        console.log("La base "+dataBaseName+" a bien été créée !");      
      }, function (e) {
        console.log("La base "+dataBaseName+" n'a pu être créée. Erreur :",e.code,e.message); 
      });
    }
  }

  initializeApp() {

    let dataBasesNameArray = ['Sydoni.db'];
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loading = this.loadingCtrl.create({
        content: 'Chargement en cours...'
      });
      this.loading.present();
      this.initAllDatabases(dataBasesNameArray)
      .then( () => {
        this.initialize()
        this.navigateTostartPage();

      }, (err) => {
        console.log(err);
        setTimeout(() => {
          //splashScreen.hide();
        },100);
      })
  });

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
  initialize(){
  }
  navigateTostartPage(){
    this.auth.loadUserCredentials().then(data => {
      if(data){
      this.rootPage = ProjectsPage;
    } else {
      this.rootPage = LoginPage;
    }
    this.loading.dismiss();
  });
  }
}
