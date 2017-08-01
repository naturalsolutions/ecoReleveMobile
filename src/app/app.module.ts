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
import { AvifaunePage} from '../observation/proto-forms/avifaune/avifaune';  
import { MammofaunePage} from '../observation/proto-forms/mammofaune/mammofaune';  
import { HerpetofaunePage} from '../observation/proto-forms/herpetofaune/herpetofaune'; 
import { MapPage} from '../observation/map/map'; 

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ProtocolsServiceProvider } from '../providers/protocols-service';
import { Network } from '@ionic-native/network';
import { NetworkService } from '../shared/network.service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProtocolsPage,
    ProjectsPage,
    ObservationPage,
    AvifaunePage,
    MammofaunePage,
    HerpetofaunePage,
    MapPage
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
    AvifaunePage,
    MammofaunePage,
    HerpetofaunePage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProtocolsServiceProvider,
    Network,
    NetworkService,
    Geolocation,
  ]
})
export class AppModule {}
