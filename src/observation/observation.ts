import { Component, Output,ElementRef, ViewChild,ComponentFactoryResolver,AfterViewInit,Renderer } from '@angular/core'

import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

import { Storage } from '@ionic/storage';

//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams, PopoverController,Platform,ToastController,LoadingController  } from 'ionic-angular'
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
  loading : any;
  sameStation : any
  editIsDisabled :any =  false

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
    private renderer : Renderer,
    public loadingCtrl: LoadingController
  ) {
    this.protocol = navParams.data.protoObj;
    this.projId = navParams.get("projId");
    // check if we can edit obs (not yet pushed)
    if(!navParams.get("isEditable")) {
      this.editIsDisabled = 'disabled' ;
    }
    
    this.obsId = navParams.data.obsId || 0;
    //console.log('in obs page, onsId =' + this.obsId)
    if(this.protocol){
      this.protocolName = this.protocol.name;
    }
    

  }

  ionViewDidLoad() {
    console.log('obs load')
    this.sameStation = false;
  }
   ionViewDidEnter() {
    console.log('obs load')
    this.title = this.protocol.label;
    // get coordinates for new obs
    if(this.obsId == 0){
      this.getPosition();
    }

    //this.geoServ.notifyOther();
  }

  onSubmit() {
    this.myProto.onSubmit(this.segment)
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
    console.log(this.myProto.images)
    let btn = this.el.nativeElement.querySelector('.btnsubmit')
    if((this.segment == 'localisation')&&( btn.innerText != 'TERMINER')) {
      this.segment = 'obligatoire'
      this.actionsStatus = true
      this.myProto.hideEspBtn = true;
    } 
    else if((this.segment == 'obligatoire') &&(!this.sameStation)){
      this.segment ='facultatif';
      btn.innerText = 'Terminer';
      this.myProto.hideEspBtn = false;
      this.actionsStatus = false;
    } 
    else if (this.sameStation) {
      this.segment ='obligatoire'
      this.myProto.hideEspBtn = false;
    }
    else {
      this.actionsStatus = false;
      this.myProto.hideEspBtn = true;
    }
    this.myProto.segment = this.segment
    this.sameStation = false
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
        this.loading = this.loadingCtrl.create({
          content: 'aquisition des coordonnées...'
        });
        this.loading.present();
      this.geolocation.getCurrentPosition({enableHighAccuracy:true, timeout: 20000, maximumAge: 0}).then(pos => {
        //this.presentToast('lat: '+ pos.coords.latitude + ", lon: " +pos.coords.longitude, 'top' )
        this.myProto.updatePosition(pos.coords.latitude ,pos.coords.longitude);
        this.loading.dismiss();

      }, (err) => {
        this.loading.dismiss();
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
    let projId = this.projId
    let obsId = this.obsId
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
      let image = "data:image/jpeg;base64," + imageData;
      //console.log(this.image);
      //let images =  this.myProto.getImages();
      let images =  this.myProto.images;
      //let storageName = 'image' + '-' + Date.now() ;
      //images.push(storageName);
      images.push(image);
      this.myProto.images = images;
      //this.storage.set('storageName', image);

  }, (err) => {
      console.log(err);
  });

})

}
handleMapSize(size) {
  if(size){
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', 'none' );   
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.footer'), 'display', 'none' ); 
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'margin-top', '0px' );
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'padding', '0px' );
  } else {
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', '' );
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'margin-top', '112px' );
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.footer'), 'display', '' ); 
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.scroll-content'), 'padding', '16px' );
  }
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
