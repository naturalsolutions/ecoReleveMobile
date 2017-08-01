import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
//import {Geolocation } from '@ionic-native/geolocation';
import {MapPage} from '../../map/map'
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'avifaune',
  templateUrl: 'avifaune.html',
})
export class AvifaunePage {
@Input('segment') segment: string;
public formModel: FormGroup;
public dateObs : any;
public latitude: any;
public longitude: any;

//latitude : number;
//longitude:number;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams ,
    private  builder: FormBuilder, 
    public storage : Storage
   // , private geolocation: Geolocation
  ) {
    // load avifaune obs
    this.storage.get('avifauneObs').then((data)=>{
    //// console.log('avifaune data');
    //  console.log(data)
    })
  }

  ngOnInit() {
    
    this.formModel = this.builder.group({
        'type_inventaire': [
          '', // default value
          [Validators.required]
        ],
        'nom_vernaculaire': [
          'test',
          [Validators.required]
        ],
        'effectif' : [
          '',
          [Validators.required]
        ],
        'type_milieu' : [''],
        'comportement'  : [''],
        'sexe': [''],
        'code_atlas' : [''],
        'hauteur_vol': [''], 
         'latitude' : [],
         'longitude' : [],
         'dateObs' : [],
         'heure' : []
      });

      // set date value
      this.dateObs =  Date.now();
      this.formModel.value.dateObs = this.dateObs;
      console.log('submit model : ')
    console.log(this.formModel.value)

      // get location
      /*this.geolocation.getCurrentPosition().then((position)=> {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('latitude :' + this.latitude);
      })*/

  }

  onSubmit(value) {

    
    ////console.log('formModel : ')
    //console.log(this.formModel.invalid)
    // check if model is valid
    
    if (!this.formModel.invalid) {
      value.finished = true;
      
    // set date value
    value.dateObs = this.dateObs;
    // set latitude & longitude
   value.latitude = this.latitude;
   value.longitude = this.longitude;
   console.log('value to push:')
   console.log(value)

    this.storage.get('avifauneObs').then((data)=>{
      if(data != null){
        data.push(value);
        this.storage.set('avifauneObs', data);
      } else {
        let array = [];
        array.push(value);
        this.storage.set('avifauneObs', array);
      }
    });
    }
  }
  handleLatChange(lat){
    console.log('form model latitude :')
    lat = lat.toFixed(5);
    this.formModel.value.latitude = lat;
    console.log(this.formModel.value)
    this.latitude = lat;
  

       // console.log(this.formModel)
  }
  handleLonChange(lon){
      lon = lon.toFixed(5);
    this.formModel.value.longitude = lon;
    this.longitude = lon;

  }

}
