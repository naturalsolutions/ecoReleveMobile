import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from '@angular/http';
import { IonicStorageModule  } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../home/home';
import { ProtocolsPage } from '../protocols/protocols';
import { ProjectsPage } from '../projects/projects';
import { ObservationPage} from '../observation/observation'; 
import { PostsPage } from '../pages/posts/posts';
import { ObservationsPage } from '../observations/observations';
import { LoginPage} from '../login/login';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProtocolsServiceProvider } from '../providers/protocols-service';
import { Network } from '@ionic-native/network';
import { NetworkService } from '../shared/network.service';
import { PostsDataProvider } from '../providers/posts-data/posts-data';
import { ObsProvider } from '../providers/obs/obs';
import { CommonService } from '../shared/notification.service';
import {GeoService} from '../shared/geolocation.notification.service';
import { MapNotificationService } from '../shared/map.notification.service'; 
import { ProtocolFormComponent } from '../components/protocol-form/protocol-form';
import { BatrachofauneComponent } from '../observation/proto-forms//batrachofaune/batrachofaune';
import { AvifauneComponent } from '../observation/proto-forms/avifaune/avifaune';  
import { MammofauneComponent } from '../observation/proto-forms//mammofaune/mammofaune';
import { HerpetofauneComponent } from '../observation/proto-forms/herpetofaune/herpetofaune';  

import {PopoverPage} from'../observation/popoverPage'
import {  MapComponent} from '../components/map/map'; 
import { AdDirective }    from '../shared/ad.directive';
import { AdFormService} from '../observation/proto-form-provider'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProtocolsPage,
    ProjectsPage,
    ObservationPage,
    PostsPage,
    ObservationsPage,
    LoginPage,
    ProtocolFormComponent,
    BatrachofauneComponent,
    AvifauneComponent,
    MammofauneComponent,
    HerpetofauneComponent,
    MapComponent,
    PopoverPage,
    AdDirective
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule .forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProtocolsPage,
    ProjectsPage,
    ObservationPage,
    PostsPage,
    ObservationsPage,
    LoginPage,
    MapComponent,
    PopoverPage,
    AvifauneComponent,
    HerpetofauneComponent,
    MammofauneComponent,
    BatrachofauneComponent
    

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProtocolsServiceProvider,
    Network,
    NetworkService,
    Geolocation,
    PostsDataProvider,
    ObsProvider,
    CommonService,
    MapNotificationService,
    GeoService,
    AdDirective,
    AdFormService
  ]
})
export class AppModule {}
