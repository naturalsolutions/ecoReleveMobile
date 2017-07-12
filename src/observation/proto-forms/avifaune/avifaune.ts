import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
//import {Geolocation } from '@ionic-native/geolocation';
//import {MapPage} from '../../map/map'


@IonicPage()
@Component({
  selector: 'avifaune',
  templateUrl: 'avifaune.html',
})
export class AvifaunePage {
@Input('segment') segment: string;
public formModel: FormGroup;
//latitude : number;
//longitude:number;

  constructor(public navCtrl: NavController, public navParams: NavParams ,private  builder: FormBuilder
   // , private geolocation: Geolocation
  ) {
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
        'hauteur_vol': ['']
      });

      // get location
      /*this.geolocation.getCurrentPosition().then((position)=> {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('latitude :' + this.latitude);
      })*/

  }

  onSubmit(value) {
    //console.log(this.todo)
    alert('submit');
  }

}
