import { Component, Output,ElementRef, ViewChild } from '@angular/core';
//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams, Events,PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { CommonService } from '../shared/notification.service';   // notify exit view to childs
import { Subscription } from 'rxjs/Subscription';
import {GeoService} from '../shared/geolocation.notification.service';
import {PopoverPage} from'./popoverPage'

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
})


export class ObservationPage  {
  protocol : any;
  protocolName : any;
  segment: string= 'localisation';
  title: any;
  obsId : number = null;
  actionsStatus : boolean = true;
  popover : any;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private platform: Platform, 
    private geolocation: Geolocation,
    private commonService: CommonService,
    private geoServ : GeoService,
    private el: ElementRef,
    public events: Events,
    private popoverCtrl: PopoverController
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
    // get coordinates
    this.geoServ.notifyOther();
  }

  onSubmit(value) {
    //console.log(this.todo)
    //console.log(this.form)
    this.events.publish('formSubmit', value, this.segment);
    this.switchToNextSegment()

  }
  ngOnInit() {
     // console.log('pass');
  }
  ionViewWillLeave() {
    //this.exitpage.emit()
    this.commonService.notifyOther({option: 'call', value: 'exit view'});

  }
  onSegmentChanged($event) {
    let btn = this.el.nativeElement.querySelector('.btnsubmit')
    if (($event._value == 'localisation') || ($event._value == 'obligatoire')) {
       btn.innerText = 'Suivant';
       // display or hide btn "plus d'actions"
       this.actionsStatus = true;
       
     }
    else {
      btn.innerText = 'Terminer';
      this.actionsStatus = false;
    }
    if (($event._value == 'obligatoire')) {
      this.actionsStatus = false;
    }
  }
  switchToNextSegment(){
    console.log('segment')
    let btn = this.el.nativeElement.querySelector('.btnsubmit')
    if(this.segment == 'localisation') {
      this.segment = 'obligatoire'
      this.actionsStatus = true
    } 
    else if(this.segment == 'obligatoire'){
      this.segment ='facultatif';
      btn.innerText = 'Terminer';
      this.actionsStatus = false;
    } else {
      this.actionsStatus = false;
    }
  }

  getbtnSubmitWidth(){
    if(this.segment == 'localisation') {
      return "100%"
    } else {
      return "50%"
    }
  }
  presentPopoverActions(ev) {
    
        this.popover = this.popoverCtrl.create(PopoverPage, {});
        this.popover.present({
          ev: ev
        });
  }
}
