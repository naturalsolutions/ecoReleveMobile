import { Injectable, Inject } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {Geolocation } from '@ionic-native/geolocation'

@Injectable()
export class GeoService {
  protected notify = new Subject<any>();
  private  latitude : number
  private longitude:number
  /**
   * Observable string streams
   */
  notifyObservable$ = this.notify.asObservable();

  constructor(private geolocation: Geolocation){
      /*this.geolocation.getCurrentPosition().then((position)=> {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
      })*/
      this.notifyOther()
  }

  public notifyOther() {
    this.geolocation.getCurrentPosition().then((position)=> {
      this.notify.next([position.coords.latitude, position.coords.longitude]);
      //this.latitude = position.coords.latitude
     // this.longitude = position.coords.longitude
    })
    /*if (this.latitude && this.longitude) {
      this.notify.next([this.latitude,this.longitude]);
    }*/
  }
}