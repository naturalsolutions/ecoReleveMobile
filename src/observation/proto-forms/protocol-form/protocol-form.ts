import { Component, Input,ElementRef } from '@angular/core';
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


@Component({
  selector: 'protocol-form',
  templateUrl: 'protocol-form.html',

})
export class ProtocolFormComponent {

    //@Input('segment') segment: string;
    //@Input() obsId: number;
    public formModel: FormGroup;
    public dateObs : any;
    public latitude: any;
    public longitude: any;
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
            this.latitude = this.instance.latitude;
            this.longitude = this.instance.latitude;
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
  onSubmit(value,segment) {
    // check if model is valid
    if ((!this.formModel.invalid) &&(segment =='facultatif')) {
      this.formModel.value.finished = true;
      this.formModel.value.projId = this.projId;
      this.formUpdateData();
      //this.navCtrl.pop();
      this.presentToast('Observation enregistrée.', 'top' )
      this.reinitform();

      //this.navCtrl.push(ObservationsPage, {projId : this.projId})
    } else {
      if(segment =='facultatif'){
        this.presentAlert()
      }
      
    }
  }
  reinitform(){
    this.parent.segment = 'localisation';
    this.buildForm(this.instance);
    this.parent.getPosition();
    console.log(' initialisation form ')
    console.log(this.formModel.value)
    // display coordinates
    this.latitude = this.instance.latitude;
    this.longitude = this.instance.latitude;
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
  presentPopoverAutocomp(ev, protocole) {
    ev.stopPropagation();
    this.formModel.controls['nom_vernaculaire'].setValue('');
    let popover = this.modalCtrl.create(PopoverAutocompPage, { parent : this, protocole : protocole},{cssClass: 'autocomp'});
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
  presentToast(message, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position : position
    });
    toast.present();
  }
}
