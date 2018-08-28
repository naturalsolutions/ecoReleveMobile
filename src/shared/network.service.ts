import { Injectable,HostBinding } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular'
import { Network } from '@ionic-native/network';
import { Response } from '@angular/http'

import {Observable} from 'rxjs/Rx';

import 'rxjs/add/operator/filter';


@Injectable()
export class NetworkService {


  // public _networkType$: BehaviorSubject<any> = new BehaviorSubject(null);
  private networkStatus: string;
  
    @HostBinding('class.error-network') get isErrorNetwork() {
      return this.networkStatus == 'hasErrorNetwork'
    }
  constructor(
    public alertCtrl: AlertController,
    private platform: Platform,
    private network: Network
  ) {
/*
          //Network Listerner
          this.renderer.listenGlobal('window', 'online', (evt) => {
            console.log('online');
            this.networkStatus = 'hasNetwork';

          });
          this.renderer.listenGlobal('window', 'offline', (evt) => {
            console.log('offline');

            this.networkStatus = 'hasErrorNetwork';
          })
          */
  }

  // get networkType$() {
  //   return this._networkType$.asObservable();
  // }

  getNetworkStatus() {
    return navigator.onLine || (this.platform.is('cordova') && this.network.type !== 'none' )
  }

  getNetworkType() {
    if (this.platform.is('cordova')) {
      return this.network.type;
    } else {
      return navigator.onLine ? 'online' : 'none';
    }
  }

  handleError (error: Response | any) {
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `ERROR HTTP status: ${error.status} - statusText: ${error.statusText || ''} - body: ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }

  handleErrorStatus (error: Response | any) {
    let errStatus: string;

    if (error instanceof Response) {
      errStatus = `${error.status}`;

    } else {
      errStatus = error.message ? error.message : error.toString();
    }

    return Observable.throw(errStatus);
  }

  manageErrorStatus(errStatus) {
    let message: string;

    if (errStatus === '0') {
      message = 'Votre connexion Internet est désactivée.';
    } else {
      message = 'L\'application a rencontré un problème.\n Veuillez recommencer ultérieurement, merci !';
    }
    return message;
  }

  showAlertNetworkError(errStatus) {
    let message = this.manageErrorStatus(errStatus);

    let alert = this.alertCtrl.create({
      message: message
    });

    alert.present();
  }

}