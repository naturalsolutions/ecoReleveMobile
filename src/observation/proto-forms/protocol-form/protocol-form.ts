import { Component, Input,ElementRef,EventEmitter,Output } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ModalController,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
//import {Geolocation } from '@ionic-native/geolocation';
import {MapComponent} from '../../../components/map/map'
import { ObservationsPage } from '../../../observations/observations';
//import { Storage } from '@ionic/storage';
import {ObsProvider} from '../../../providers/obs/obs'
import { CommonService } from '../../../shared/notification.service';
import { Subscription } from 'rxjs/Subscription';
import {GeoService} from '../../../shared/geolocation.notification.service';
import {PopoverAutocompPage} from'./popoverAutocompPage'
import {config }  from '../../../config';

@Component({
  selector: 'protocol-form',
  templateUrl: 'protocol-form.html',

})
export class ProtocolFormComponent {

    //@Input('segment') segment: string;
    //@Input() obsId: number;
    @Output() mapfullsize = new EventEmitter()
    public formModel: FormGroup;
    public dateObs : any;
    public latitude: any;
    public longitude: any;
    public trace : any;
    private subscription: Subscription;
    private geoSub :  Subscription;
    private obsSaved : boolean = false;
    private formChanged  : boolean = false;
    private segment: string;
    private obsId: number;
    private projId : number;
    private hideEspBtn : boolean = true;
    private image : any;
    private instance : any;
    public parent;
    public images = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    public  builder: FormBuilder, 
    //public storage : Storage,
    public data : ObsProvider,
    public commonService: CommonService,
    public geoServ : GeoService,
    private el: ElementRef,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public toastCtrl: ToastController,
    //public completeTaxaService: CompleteTaxaService
   // , private geolocation: Geolocation
  ) {
    /*events.subscribe('formSubmit', (event, segment) => {
      this.onSubmit(event, segment)
    });*/
    this.data.getObs(this.projId);
  }
    ngOnInit(protocolClass) {
    //let instance : any
      // update existing obs
      if(this.obsId){
        this.instance = new protocolClass(this.obsId)
        this.data.getObsById(this.obsId).then((obs)=>{
           for(var key in obs) {
            this.instance[key] = obs[key];
          }
            this.buildForm(this.instance)
            // display coordinates
            this.latitude = parseFloat(this.instance.latitude);
            this.longitude = parseFloat(this.instance.longitude);

            // get json trace if exists
            if(this.instance.trace) {
              this.trace = this.instance.trace
            } else {
              this.trace = null;
            }
        });

      } else {
        this.instance = new protocolClass(null)
        this.buildForm(this.instance)
      }

      this.projId = this.navParams.data.projId;

      // get coordinates
      /*this.geoSub = this.geoServ.notifyObservable$.subscribe((res) => {
        console.log('geo service')
        console.log('latitude : ' + res[0])
        this.handleLatChange(res[0])
        this.handleLonChange(res[1])
       });*/

      // subscription to notify exit view obsto store data
      this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
       if(!this.obsSaved  && (this.formChanged)) {    // && (!this.obsId)
             this.saveCurrent()
       }

       });
  }
    buildForm(model){
        this.formModel = this.getFormModel(model);
      // set date value
      this.dateObs = Date.now();//  Date.now().getTime();
      if(this.formModel.value.images && (this.formModel.value.images.length >0)) {
        this.images = this.formModel.value.images;
      }
      this.formModel.value.dateObs = this.dateObs;
      // detect form changes to activate "save current obs"
      this.formModel.valueChanges.subscribe(data => {
        this.formChanged = true;
    })
  }

  getFormModel(model){
    // to redefine
     return this.builder.group({

     });
  }
  /*getImages(){
    //let images = this.formModel.value.images
    if(!this.images){
      images= [];
    }
    return images ;
  }*/
  setImages(tab){
    this.formModel.value.images = tab;
    console.log('***images****');
    console.log(this.formModel.value.images);
  }
  onSubmit(segment) {
    // check if model is valid
    if ((!this.formModel.invalid) &&(segment =='facultatif')) {
      this.formModel.value.finished = true;
      this.formModel.value.images= this.images;
      this.formModel.value.trace = this.trace
      console.log(this.formModel.value)
      this.formModel.value.projId = this.projId;
      this.formUpdateData();
      //this.navCtrl.pop();
      this.presentToast('Observation enregistrée.', 'top' )
      let latitude = this.latitude
      let longitude = this.longitude
      let fieldvalue = null
      let fieldName = null
      if(config.defautLastObsValue) {
        fieldName = config.fieldName
        fieldvalue = this.formModel.value[fieldName]
      }
      if(config.defaultLastStation){
        this.parent.sameStation = true
      }
      this.reinitform(latitude,longitude,fieldName, fieldvalue);

      //this.navCtrl.push(ObservationsPage, {projId : this.projId})
    } else {
      if(segment =='facultatif'){
        this.presentAlert()
      }
      
    }
  }
  reinitform(latitude,longitude,fieldName,fieldvalue){

    
    
    
    /*this.formModel.valueChanges.subscribe(data => {
      this.formChanged = true;
    })*/
    if(config.defaultLastStation) {
      // TODO : update val -> obligatoire
      
      this.parent.segment = 'obligatoire';
      this.formModel.value.latitude = latitude;
      this.formModel.value.longitude = longitude;
    } else {
      this.parent.segment = 'localisation';
      this.parent.getPosition();
      // display coordinates
      this.latitude = this.instance.latitude;
      this.longitude = this.instance.longitude;
    }
    if(config.defautLastObsValue) {
      this.formModel.value[fieldName] = fieldvalue
      this.instance[fieldName] = fieldvalue
    }
    
    this.buildForm(this.instance);
    
    // update date 
    this.dateObs = Date.now();//  Date.now().getTime();
    this.formModel.value.dateObs = this.dateObs;

    console.log(' initialisation form ')
    console.log(this.formModel.value)
    

  }


  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Champs requis',
      subTitle: 'Merci de saisir les champs obligatoires.',
      buttons: ['Ok']
    });
    alert.present();
  }

  saveCurrent(){
    let value = this.formModel.value;
    value.finished = false;
    this.formUpdateData();
  }

  formUpdateData() {
    let value = this.formModel.value
    // set date value
    value.dateObs = this.dateObs;
    // set latitude & longitude
   value.latitude = this.latitude;
   value.longitude = this.longitude;
   value.projId = this.projId;
    // set id value if exists 
    if(this.obsId){
       value.id = this.obsId;
    }
    this.data.saveObs(value)
    this.obsSaved = true;
    this.images = [];
  }

  handleLatChange(lat){
    lat = lat.toFixed(5);
    this.formModel.value.latitude = lat;
    this.latitude = lat;
  }
  handleLonChange(lon){
    lon = lon.toFixed(5);
    this.formModel.value.longitude = lon;
    this.longitude = lon;
  }
  handleTraceChange(json){
    console.log('*****json******')
    console.log(json)
    this.trace = JSON.stringify(json) 

  }
  ionViewDidLoad() {

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    //this.geoSub.unsubscribe();
    //this.events.unsubscribe('formSubmit');
  }
  updatePosition(lat, lon) {
    this.handleLatChange(lat)
    this.handleLonChange(lon) 
  }
  presentPopoverAutocomp(protocole) {

    this.formModel.controls['nom_vernaculaire'].setValue('');
    let popover = this.modalCtrl.create(PopoverAutocompPage, { protocole : protocole},{cssClass: 'autocomp'});
    popover.onDidDismiss(data => {
      console.log(data);
      this.formModel.patchValue(data);
       //this.formModel.value.nom_vernaculaire = data.nom_vernaculaire
     // this.formModel.value.nom_scientifique = data.

  //this.parent.formModel.controls['nom_vernaculaire'].setValue(verna);
  //this.parent.formModel.controls['nom_scientifique'].setValue(scientifique);
    })    
    popover.present();

  }
  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position : position
    });
    toast.present();
  }
  handleMapSize(size) {
    this.parent.handleMapSize(size);
    //console.log('size')
   // console.log(size)
    //alert('size')
  }
  deleteImage(image){
    let self = this;
    let alert = this.alertCtrl.create({
      title: 'Suppression de photo',
      message: 'Etes vous sur(e) de supprimer cette photo?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Oui',
          handler: () => {
            self.images.forEach( (item, index) => {
              if(item === image) self.images.splice(index,1);
            });
          }
        }
      ]
    });
    alert.present();
  }





}
