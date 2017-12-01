import { Component, ViewChild, HostBinding,Renderer } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { NetworkService } from '../shared/network.service';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
//import { PostsPage } from '../pages/posts/posts';
//import { ProtocolsPage } from '../pages/protocols/protocols';
import { ProjectsPage } from '../projects/projects';
//import { LoginPage} from '../login/login';
import { LoginPage2} from '../login2/login2';
import {AuthService} from "../providers/auth";
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

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private network: Network, 
              private renderer: Renderer,
              private networkService: NetworkService,
              public storage: Storage,
              private auth: AuthService
              ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      //{ title: 'Protocoles', component: ProtocolsPage },
      { title: 'Projets', component: ProjectsPage},
      //{ title: 'Observation', component: ObservationPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initialize()
        .then(() => {
          this.navigateTostartPage()

        }, (err) => {
          console.log(err);
          setTimeout(() => {
            //splashScreen.hide();
          },100);
          
          this.navigateTostartPage()
          //this.rootPage = ProjectsPage;
        })

      /*//Network Listerner
      this.renderer.listenGlobal('window', 'online', (evt) => {
        console.log('online');
        this.networkStatus = 'hasNetwork';
      });
      this.renderer.listenGlobal('window', 'offline', (evt) => {
        console.log('offline');
        this.networkStatus = 'hasErrorNetwork';
      })*/

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
  });

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  initialize(): Promise<any> {
    return new Promise((resolve, reject) => {
      /*let loader = this.loadingCtrl.create({
        content: "Initialisation"
      });*/
      //loader.present();
      let initializers = [
        this.loadProjects()
        //this.thematicService.initialize(), 
        //this.tourService.initialize(), 
        //this.taxonService.initialize()
        ]
      Promise.all(initializers)
        .then(values => {
          //loader.dismiss();
          setTimeout(() => {
            this.splashScreen.hide();
          },100);

      resolve()
      }, (err) => {
          //loader.dismiss();
          console.log('Initialize Error:', err);
          if( !navigator.onLine || (this.platform.is('cordova') && this.network.type == 'none' )){
            this.navigateTostartPage()
            
            //this.needReload = 'needToReload';
            //this.networkStatus = 'hasErrorNetwork';
          }
      })
        .catch(reason => {
          console.log(reason)
        });
    })
  }
  loadProjects() {
  this.storage.get('projects ').then((value) => {
    console.log('projects loaded !')
    
  }).catch(() => {
    console.log('catch loading projects')
  });
}
  navigateTostartPage(){
    this.auth.loadUserCredentials().then(data => {
      if(data){
      this.rootPage = ProjectsPage;
    } else {
      this.rootPage = LoginPage2;
    }
  });
  }
}
