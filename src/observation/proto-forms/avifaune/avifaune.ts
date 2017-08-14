import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
//import {Geolocation } from '@ionic-native/geolocation';
import {MapPage} from '../../map/map'
import { ObservationsPage } from '../../../observations/observations';
//import { Storage } from '@ionic/storage';
import {ObsProvider} from '../../../providers/obs/obs'
import {Avifaune} from '../../../models/avifaune-interface';
import { CommonService } from '../../service';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'avifaune',
  templateUrl: 'avifaune.html',
})
export class AvifaunePage {
@Input('segment') segment: string;
@Input() obsId: number;
public formModel: FormGroup;
public dateObs : any;
public latitude: any;
public longitude: any;
private subscription: Subscription;
private obsSaved : boolean = false;
private formChanged  : boolean = false;

//latitude : number;
//longitude:number;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    private  builder: FormBuilder, 
    //public storage : Storage,
    private data : ObsProvider,
    private commonService: CommonService
   // , private geolocation: Geolocation
  ) {

    this.data.getObs();
  }

  ngOnInit() {

    let avifaune 
      // update existing obs
      if(this.obsId){
        avifaune = new Avifaune(this.obsId)
        this.data.getObsById(this.obsId).then((obs)=>{
           for(var key in obs) {
              avifaune[key] = obs[key];

          }
            this.buildForm(avifaune)
        });

      } else {
        avifaune = new Avifaune(null)
        this.buildForm(avifaune)
      }

      // subscription to notify exit view obsto store data
       this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
     //if (res.hasOwnProperty('option') && res.option === 'call_child') {
       if(!this.obsSaved && (!this.obsId) && (this.formChanged)) {
             this.saveCurrent()
       }

        // perform your other action from here

      //}
    });
      


      // get location
      /*this.geolocation.getCurrentPosition().then((position)=> {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('latitude :' + this.latitude);
      })*/

  }

  buildForm(model){
        this.formModel = this.builder.group({
        'protocole':'avifaune',
        'type_inventaire': [
          model.type_inventaire, // default value
          [Validators.required]
        ],
        'nom_vernaculaire': [
           model.nom_vernaculaire,
          [Validators.required]
        ],
        'effectif' : [
           model.effectif,
          [Validators.required]
        ],
        'type_milieu' : [
          model.type_milieu
        ],
        'comportement'  : [
           model.comportement
        ],
        'sexe': [
           model.sexe
        ],
        'code_atlas' : [
           model.code_atlas
        ],
        'hauteur_vol': [
           model.hauteur_vol
        ], 
         'latitude' : [
            model.latitude
          ],
         'longitude' : [
           model.longitude
          ],
         'dateObs' : [
           model.dateObs
          ]
      });
      // set date value
      this.dateObs =  Date.now();
      this.formModel.value.dateObs = this.dateObs;
      // detect form changes to activate "save current obs"
      this.formModel.valueChanges.subscribe(data => {
        this.formChanged = true;
    })
  }

  onSubmit(value) {

    // check if model is valid
    
    if (!this.formModel.invalid) {
      value.finished = true;
      this.formUpdateData(value);
      this.navCtrl.push(ObservationsPage)
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
  }

}
