import { Component, Input,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
//import {Geolocation } from '@ionic-native/geolocation';
import {MapComponent} from '../../../components/map/map'
import { ObservationsPage } from '../../../observations/observations';
//import { Storage } from '@ionic/storage';
import {ObsProvider} from '../../../providers/obs/obs'
import { CommonService } from '../../../shared/notification.service';
import { Subscription } from 'rxjs/Subscription';
import {GeoService} from '../../../shared/geolocation.notification.service';

@Component({
  selector: 'protocol-form',
  templateUrl: 'protocol-form.html'
})
export class ProtocolFormComponent {

    @Input('segment') segment: string;
    @Input() obsId: number;
    public formModel: FormGroup;
    public dateObs : any;
    public latitude: any;
    public longitude: any;
    private subscription: Subscription;
    private geoSub :  Subscription;
    private obsSaved : boolean = false;
    private formChanged  : boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    public  builder: FormBuilder, 
    //public storage : Storage,
    public data : ObsProvider,
    public commonService: CommonService,
    public geoServ : GeoService,
    private el: ElementRef
   // , private geolocation: Geolocation
  ) {
    /*events.subscribe('formSubmit', (event, segment) => {
      this.onSubmit(event, segment)
    });*/
    this.data.getObs();
  }
    ngOnInit(protocolClass) {
    let instance : any
      // update existing obs
      if(this.obsId){
        instance = new protocolClass(this.obsId)
        this.data.getObsById(this.obsId).then((obs)=>{
           for(var key in obs) {
              instance[key] = obs[key];
          }
            console.log('old instance')
            console.log(instance)
            this.buildForm(instance)
        });

      } else {
        instance = new protocolClass(null)
        console.log('new instance')
        console.log(instance)
        this.buildForm(instance)
      }

      // get coordinates
      this.geoSub = this.geoServ.notifyObservable$.subscribe((res) => {
        console.log('geo service')
        console.log('latitude : ' + res[0])
        this.handleLatChange(res[0])
        this.handleLonChange(res[1])
       });

      // subscription to notify exit view obsto store data
      this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
       if(!this.obsSaved && (!this.obsId) && (this.formChanged)) {
             this.saveCurrent()
       }

       });
  }
    buildForm(model){
        this.formModel = this.getFormModel(model);
      // set date value
      this.dateObs =  Date.now();
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
    if (!this.formModel.invalid) {
      value.finished = true;
      this.formUpdateData(value);
      this.navCtrl.push(ObservationsPage)
    } else {
      if(segment =='facultatif'){
        alert('Merci de saisir les champs obligatoires.')
      }
      
    }
  }

  saveCurrent(){
    let value = this.formModel.value;
    value.finished = false;
    this.formUpdateData(value);
  }

  formUpdateData(value) {
    // set date value
    value.dateObs = this.dateObs;
    // set latitude & longitude
   value.latitude = this.latitude;
   value.longitude = this.longitude;
    // set id value if exists 
    if(this.obsId){
        this.formModel.value.id = this.obsId;
    }
    this.data.saveObs(value)
    this.obsSaved = true;
  }

  handleLatChange(lat){
    console.log('form model latitude :')
    lat = lat.toFixed(5);
    this.formModel.value.latitude = lat;
    console.log(this.formModel.value)
    this.latitude = lat;
  
  }
  handleLonChange(lon){
      lon = lon.toFixed(5);
    this.formModel.value.longitude = lon;
    this.longitude = lon;

  }
  ionViewDidLoad() {
    console.log('page chargée')
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.geoSub.unsubscribe();
    //this.events.unsubscribe('formSubmit');
  }
}
