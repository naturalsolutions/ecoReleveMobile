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
import { ObservationsPage } from '../observations/observations';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProtocolsServiceProvider } from '../providers/protocols-service';
import { Network } from '@ionic-native/network';
import { NetworkService } from '../shared/network.service';
import { PostsDataProvider } from '../providers/posts-data/posts-data';
import { ObsProvider } from '../providers/obs/obs';
import {AuthService} from "../providers/auth";;
import { CommonService } from '../shared/notification.service';
import {GeoService} from '../shared/geolocation.notification.service';
import { MapNotificationService } from '../shared/map.notification.service'; 
import { ProtocolFormComponent } from '../components/protocol-form/protocol-form';
import { AvifauneComponent } from '../observation/proto-forms/avifaune/avifaune';  
import { MammofauneComponent } from '../observation/proto-forms//mammofaune/mammofaune';
import { HerpetofauneComponent } from '../observation/proto-forms/herpetofaune/herpetofaune';  
import { ChiropteresComponent } from '../observation/proto-forms/chiropteres/chiropteres';  
import { FloreComponent } from '../observation/proto-forms/flore/flore';  
import { InsectesComponent } from '../observation/proto-forms/insectes/insectes';  

import {PopoverPage} from'../observation/popoverPage';
import {PopoverAutocompPage} from'../observation/proto-forms/protocol-form/popoverAutocompPage'

import {  MapComponent} from '../components/map/map'; 
import { AdDirective }    from '../shared/ad.directive';
import { AdFormService} from '../observation/proto-form-provider'
import { LoginPage } from '../login/login';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProtocolsPage,
    ProjectsPage,
    ObservationPage,
    ObservationsPage,
    LoginPage,
    ProtocolFormComponent,
    AvifauneComponent,
    MammofauneComponent,
    HerpetofauneComponent,
    ChiropteresComponent,
    FloreComponent,
    InsectesComponent,
    MapComponent,
    PopoverPage,
    PopoverAutocompPage,
    AdDirective
  ],
  imports: [
    HttpModule,

    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule .forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProtocolsPage,
    ProjectsPage,
    ObservationPage,
    ObservationsPage,
    LoginPage,
    MapComponent,
    PopoverPage,
    PopoverAutocompPage,
    AvifauneComponent,
    HerpetofauneComponent,
    ChiropteresComponent,
    MammofauneComponent,
    FloreComponent,
    InsectesComponent
    

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
    AdFormService,
    AuthService,
    SQLite

  ]
})
export class AppModule {}
