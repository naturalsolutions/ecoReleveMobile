import { Component, Output,ElementRef, ViewChild,ComponentFactoryResolver,AfterViewInit } from '@angular/core'
//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular'
import { Geolocation } from '@ionic-native/geolocation'
import { Platform } from 'ionic-angular'
import { CommonService } from '../shared/notification.service'  // notify exit view to childs
import { Subscription } from 'rxjs/Subscription'
import {GeoService} from '../shared/geolocation.notification.service'
import {PopoverPage} from'./popoverPage'
import { AdDirective } from '../shared/ad.directive'
import{AdFormService} from './proto-form-provider'


@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html'
})


export class ObservationPage  {

  @ViewChild(AdDirective) adForm: AdDirective;

  protocol : any;
  protocolName : any;
  segment: string= 'localisation';
  title: any;
  obsId : number = null;
  actionsStatus : boolean = true;
  popover : any;
  myProto : any;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private platform: Platform, 
    private geolocation: Geolocation,
    private commonService: CommonService,
    private geoServ : GeoService,
    private el: ElementRef,
    //public events: Events,
    private popoverCtrl: PopoverController,
    private componentFactoryResolver: ComponentFactoryResolver,
    private adFormService : AdFormService
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

  }
   ionViewDidEnter() {
    this.title = this.protocolName;
    // get coordinates
    this.geoServ.notifyOther();
  }

  onSubmit(value) {
    this.myProto.onSubmit(value,this.segment)
    this.switchToNextSegment()

  }
  ngOnInit() {

  }
  ionViewWillLeave() {

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
    this.myProto.segment = this.segment;
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
    this.myProto.segment = this.segment
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
  ngAfterViewInit() {
    this.loadComponent();
  }
  loadComponent() {

    let component = this.adFormService.getComponent(this.protocolName)

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    let viewContainerRef = this.adForm.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);


		this.myProto= componentRef.instance;
		this.myProto.segment = this.segment;

  }
}
