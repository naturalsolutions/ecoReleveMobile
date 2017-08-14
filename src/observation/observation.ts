import { Component, Output, EventEmitter } from '@angular/core';
//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { CommonService } from './service';   // notify exit view to childs
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
})


export class ObservationPage  {
  protocol : any;
  protocolName : any;
  segment: string= 'obligatoire';
  title: any;
  obsId : number = null;
  @Output() exitpage = new EventEmitter()



  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private platform: Platform, 
    private geolocation: Geolocation,
    private commonService: CommonService
  
  ) {
    this.protocol = navParams.data.protoObj;
    this.obsId = navParams.data.obsId || 0;
    //console.log('in obs page, onsId =' + this.obsId)
    this.protocolName = this.protocol.name;
    /*   platform.ready().then(() => {

      // get current position
      geolocation.getCurrentPosition().then(pos => {
        console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
      });
        });*/
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ObservationPage');
    //console.log(this);
  }
   ionViewDidEnter() {
    this.title = this.protocolName;
  }

  onSubmit(value) {
    //console.log(this.todo)

  }
  ngOnInit() {
     // console.log('pass');
  }
  ionViewWillLeave() {
    //this.exitpage.emit()
    this.commonService.notifyOther({option: 'call', value: 'exit view'});
  }

}
