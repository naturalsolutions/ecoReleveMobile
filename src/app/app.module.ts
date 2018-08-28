import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule} from '@angular/http';
import { IonicStorageModule  } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../home/home';

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
import {PopoverHelpPage} from'../observations/popoverHelpPage';
import {PopoverAutocompPage} from'../observation/proto-forms/protocol-form/popoverAutocompPage'
import {PopoverHelpProj} from'../projects/popoverHelpProj'

import { AdFormService} from '../observation/proto-form-provider'
import { SQLite } from '@ionic-native/sqlite';
import { MapComponentModule } from '../components/map/map.module';
import { LoginPageModule } from '../login/login.module';
import { ObservationPageModule } from '../observation/observation.module';
import { ObservationsPageModule } from '../observations/observations.module';
import { ProjectsPageModule } from '../projects/projects.module';
import { ProtocolsPageModule } from '../protocols/protocols.module';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProtocolFormComponent,
    AvifauneComponent,
    MammofauneComponent,
    HerpetofauneComponent,
    ChiropteresComponent,
    FloreComponent,
    InsectesComponent,
    PopoverPage,
    PopoverAutocompPage,
    PopoverHelpPage,
    PopoverHelpProj
    
  ],
  imports: [
    HttpModule,
    MapComponentModule,
    BrowserModule,
    LoginPageModule,
    ObservationPageModule,
    ObservationsPageModule,
    ProjectsPageModule,
    ProtocolsPageModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
    }),
    IonicStorageModule .forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PopoverPage,
    PopoverHelpPage,
    PopoverHelpProj,
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
    AdFormService,
    AuthService,
    SQLite

  ]
})
export class AppModule {}
