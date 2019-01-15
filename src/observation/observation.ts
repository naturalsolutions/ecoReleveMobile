import { Component, ElementRef, ViewChild, ComponentFactoryResolver, Renderer, OnInit, AfterViewInit } from '@angular/core'

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

import { Storage } from '@ionic/storage';

//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams, PopoverController, Platform, ToastController, LoadingController } from 'ionic-angular'
import { Geolocation } from '@ionic-native/geolocation'
import { CommonService } from '../shared/notification.service'  // notify exit view to childs
import {PopoverPage} from'./popoverPage'
//import { AdDirective } from '../shared/ad.directive'
//import { AdFormService } from './proto-form-provider'
import {DynamicFormComponent} from '../components/dynamicForms/dynamic-form.component'
import { ObsProvider } from '../providers/obs/obs'
import { ProtocolDataServiceProvider } from '../providers/protocol-data-service'

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
  providers: [File,
    Transfer,
    Camera,
    FilePath,
    ProtocolDataServiceProvider],
})


export class ObservationPage implements OnInit, AfterViewInit {

  //@ViewChild(AdDirective) adForm: AdDirective;
  @ViewChild(DynamicFormComponent) child: DynamicFormComponent
  gpsPickerValue : boolean = false

  protocol: any;
  protocolName: any;
  segment: string = 'localisation';
  title: any;
  obsId: number = null;
  actionsStatus: boolean = true;
  popover: any;
  myProto: any;
  projId: any = null
  lastImage: string = null;
  image: any;
  nbRelances = 0
  loading: any;
  sameStation: any
  editIsDisabled: any = false
  params : any = {id : 'toto'}


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private geolocation: Geolocation,
    private commonService: CommonService,
    private el: ElementRef,
    //public events: Events,
    private popoverCtrl: PopoverController,
    private componentFactoryResolver: ComponentFactoryResolver,
    //private adFormService: AdFormService,
    public toastCtrl: ToastController,
    public data : ObsProvider,
    private camera: Camera, 
    public storage : Storage,
    private renderer : Renderer,
    public loadingCtrl: LoadingController,
    private protoDataService : ProtocolDataServiceProvider
    
  ) {
    this.protocol = navParams.data.protoObj;
    this.projId = navParams.get("projId");
    
    // check if we can edit obs (not yet pushed)
    if (!navParams.get("isEditable")) {
      this.editIsDisabled = 'disabled';
    }

    this.obsId = navParams.data.obsId || 0;
    //console.log('in obs page, onsId =' + this.obsId)
    if (this.protocol) {
      this.protocolName = this.protocol.name;
      //this.child.protocol = this.protocol
    }

    // params for dyn-form component
    console.log('obs compo', this.obsId)
    /*protoDataService.setObsId(this.obsId) 
    protoDataService.setProjId(this.projId)
    protoDataService.setSegment(this.segment)
    protoDataService.setProtocol(this.protocol)*/
    this.params= {
      obsId : this.obsId,
      projId : this.projId,
      segment : this.segment,
      protocol : this.protocol
    }


  }

  onInitView(){

    
    
  }
  ngAfterViewInit() {
 
  }

  ionViewDidLoad() {

    console.log('obs load')
    this.sameStation = false;
  }
   ionViewDidEnter() {
    this.nbRelances = 0;
    console.log('obs load')
    this.title = this.protocol.label;
    // get coordinates for new obs
    if (this.obsId == 0) {
      this.getPosition();
    }
    //this.geoServ.notifyOther();

  }

  onSubmit() {
    //this.myProto.onSubmit(this.segment)
    this.child.onSubmit(this.segment)
    this.switchToNextSegment()

  }
  ngOnInit() {

  }
  ionViewWillLeave() {

    this.commonService.notifyOther({option: 'call', value: 'exit view'});
    this.nbRelances = 5;

  }
  onSegmentChanged($event) {
    let btn = this.el.nativeElement.querySelector('.btnsubmit')
    if (($event._value == 'localisation') || ($event._value == 'obligatoire')) {
      btn.innerText = 'Suivant';
      // display or hide btn "plus d'actions"
      this.actionsStatus = true;
      //this.myProto.hideEspBtn = true;
      //this.child.hideEspBtn = true;

    }
    else {
      btn.innerText = 'Terminer';
      this.actionsStatus = false;
      //this.myProto.hideEspBtn = true;
    }
    if (($event._value == 'obligatoire')) {
      this.actionsStatus = false;
      //this.myProto.hideEspBtn = false;
    }
    //this.myProto.segment = this.segment;
    this.child.segment = this.segment;
  }
  switchToNextSegment() {
    console.log('segment')
    //console.log(this.myProto.images)
    let btn = this.el.nativeElement.querySelector('.btnsubmit')
    if ((this.segment == 'localisation') && (btn.innerText != 'TERMINER')) {
      this.segment = 'obligatoire'
      this.actionsStatus = true
      //this.myProto.hideEspBtn = true;
    }
    else if ((this.segment == 'obligatoire') && (!this.sameStation)) {
      this.segment = 'facultatif';
      btn.innerText = 'Terminer';
      //this.myProto.hideEspBtn = false; 
      this.actionsStatus = false;
    }
    else if (this.sameStation) {
      this.segment = 'obligatoire'
      //this.myProto.hideEspBtn = false;
    }
    else {
      this.actionsStatus = false;
      //this.myProto.hideEspBtn = true;
    }
    //this.myProto.segment = this.segment
    this.sameStation = false
  }

  getbtnSubmitWidth() {
    if (this.segment == 'localisation') {
      return "100%"
    } else {
      return "50%"
    }
  }
  presentPopoverActions(ev) {
    
        let popover = this.popoverCtrl.create(PopoverPage, {obsId : this.obsId, parent : this, projId : this.projId},{cssClass: 'obs-actions'});
        popover.present({
          ev: ev
        });

  }
  /*loadComponent() {

    let component = this.adFormService.getComponent(this.protocolName)

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

    let viewContainerRef = this.adForm.viewContainerRef;
    viewContainerRef.clear();

    let componentRef = viewContainerRef.createComponent(componentFactory);


    this.myProto = componentRef.instance;
    this.myProto.segment = this.segment;
    this.myProto.obsId = this.obsId;
    this.myProto.projId = this.projId;
    this.myProto.parent = this;

  }*/
  async getPosition(){
    if(this.nbRelances < 4 ) {
    let subscription;
      this.platform.ready().then(() => {

        this.presentToast('Aquisition des coordonnées...' , 'top' )

      this.geolocation.getCurrentPosition({enableHighAccuracy:true, maximumAge: 60000, timeout: 20000 }).then(pos => {
        //this.myProto.updatePosition(pos.coords.latitude, pos.coords.longitude);
        this.child.updatePosition(pos.coords.latitude, pos.coords.longitude);

      }, (err) => {

        this.nbRelances +=1;
        this.presentToast('erreur gps', 'top' );
        if(this.nbRelances < 3 ) {   // TODO  -> 4
          this.getPosition();
        } else {

          /*if(this.el.nativeElement.querySelector('.gpsPickerPicto').classList) {
            this.el.nativeElement.querySelector('.gpsPickerPicto').classList.remove('hidden')
          }*/
          

        }
        
      });
      

      }).catch((error) => {

        this.presentToast('Error getting location : ' + error, 'top' )
        subscription.unsubscribe();
      });

    }

  }
  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: position,
      cssClass: "toast-error"
    });
    toast.present();
  }
  takePicture() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    // Get the data of an image
    this.platform.ready().then(() => {

      let refProto = this.child;
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.CAMERA,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      }).then((imageData) => {
        let images = refProto.images;
        let imgName = new Date().getTime() + '.jpg';
        images.push({
          path: '/path/to/' + imgName,
          name: imgName,
          base64Data: 'data:image/jpeg;base64,' + imageData
          //base64Data: imageData
        });
        refProto.images = images;

      }, (err) => {
        console.log(err);
      });
    })

  }
  handleMapSize(size) {
    if (size) {
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', 'none');
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.footer'), 'display', 'none');
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'margin-top', '0px');
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'padding', '0px');
    } else {
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', '');
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'margin-top', '112px');
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.footer'), 'display', '');
      this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'padding', '16px');
    }
  }
  onGpsPickerClick(){
    alert('obs clic')
    //this.gpsPickerEvent.emit(true)
    this.gpsPickerValue = (!this.gpsPickerValue)
    this.myProto.gpsPickerEvent = this.gpsPickerValue
  }
  updateSegment(segment){
    this.segment = segment
  }
  updateSameStation(){
    this.sameStation = true
  }

}
