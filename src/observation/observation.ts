import { Component, Output,ElementRef, ViewChild,ComponentFactoryResolver,AfterViewInit } from '@angular/core'

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

import { Storage } from '@ionic/storage';

//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams, PopoverController,Platform,ToastController  } from 'ionic-angular'
import { Geolocation } from '@ionic-native/geolocation'
import { CommonService } from '../shared/notification.service'  // notify exit view to childs
import { Subscription } from 'rxjs/Subscription'
import {GeoService} from '../shared/geolocation.notification.service'
import {PopoverPage} from'./popoverPage'
import { AdDirective } from '../shared/ad.directive'
import{AdFormService} from './proto-form-provider'
import {ObsProvider} from '../providers/obs/obs'

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
  providers : [File,
    Transfer,
    Camera,
    FilePath,  ]
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
  projId : any
  lastImage: string = null;
  image : any;
  nbRelances= 0

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
    private adFormService : AdFormService,
    public toastCtrl: ToastController,
    public data : ObsProvider,
    private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath ,
    public storage : Storage,
    

  ) {
    this.protocol = navParams.data.protoObj;
    this.projId = navParams.get("projId");
    this.obsId = navParams.data.obsId || 0;
    //console.log('in obs page, onsId =' + this.obsId)
    if(this.protocol){
      this.protocolName = this.protocol.name;
    }
    

  }

  ionViewDidLoad() {
    console.log('obs load')
  }
   ionViewDidEnter() {
    console.log('obs load')
    this.title = this.protocolName;
    // get coordinates for new obs
    if(this.obsId == 0){
      this.getPosition();
    }

    //this.geoServ.notifyOther();
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
       this.myProto.hideEspBtn = true;
       
     }
    else {
      btn.innerText = 'Terminer';
      this.actionsStatus = false;
      this.myProto.hideEspBtn = true;
    }
    if (($event._value == 'obligatoire')) {
      this.actionsStatus = false;
      this.myProto.hideEspBtn = false;
    }
    this.myProto.segment = this.segment;
  }
  switchToNextSegment(){
    console.log('segment')
    let btn = this.el.nativeElement.querySelector('.btnsubmit')
    if((this.segment == 'localisation')&&( btn.innerText != 'TERMINER')) {
      this.segment = 'obligatoire'
      this.actionsStatus = true
      this.myProto.hideEspBtn = true;
    } 
    else if(this.segment == 'obligatoire'){
      this.segment ='facultatif';
      btn.innerText = 'Terminer';
      this.myProto.hideEspBtn = false;
      this.actionsStatus = false;
    } else {
      this.actionsStatus = false;
      this.myProto.hideEspBtn = true;
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
    
        let popover = this.popoverCtrl.create(PopoverPage, {obsId : this.obsId, parent : this, projId : this.projId},{cssClass: 'obs-actions'});
        /*popover.onDidDismiss(data => {
          
                    if(data && data.action == "removeObs") {
                      let protoId= data.protoId
                      this.data.deleteObs(this.obsId)
                      this.navCtrl.pop()
                    }
                  });*/
        popover.present({
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
    this.myProto.obsId = this.obsId;
    this.myProto.projId = this.projId;
    this.myProto.parent = this;

  }
  getPosition(){
      this.platform.ready().then(() => {
      // get current position
      //this.presentToast('get coordinates', 'top')
      // TODO spinner get coordinates
      this.geolocation.getCurrentPosition({enableHighAccuracy:true, timeout: 12000, maximumAge: 0}).then(pos => {
        //this.presentToast('lat: '+ pos.coords.latitude + ", lon: " +pos.coords.longitude, 'top' )
        this.myProto.updatePosition(pos.coords.latitude ,pos.coords.longitude);

      }, (err) => {
        this.nbRelances +=1;
        this.presentToast('erreur gps', 'top' );
        if(this.nbRelances < 4 ) {
          this.getPosition();
        }
        
        //this.getPosition();
      });
      }).catch((error) => {
        //console.log('Error getting location', error);
        this.presentToast('Error getting location : ' + error, 'top' )
      });;
  }
  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position : position
    });
    toast.present();
  }
  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
     // Get the data of an image
     this.platform.ready().then(() => {
       
     this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
  }).then((imageData) => {
    // imageData is a base64 encoded string
      this.image = "data:image/jpeg;base64," + imageData;
      console.log(this.image);
      this.storage.set('image', this.image);
      this.myProto.image = this.image;
      //this.fileURL = imageData;
      //this.images.push(this.base64Image);
      //this.isPicture = 1;
      //this.uploadPictures(this.fileURL);
  }, (err) => {
      console.log(err);
  });

})

}

/*private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    console.log('fichier image');
    alert(namePath);
    console.log(newFileName);
  }, error => {
   // this.presentToast('Error while storing file.');
  });
}
// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}*/
}
