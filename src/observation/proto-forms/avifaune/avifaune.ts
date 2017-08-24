
import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Avifaune} from '../../../models/avifaune-interface';

@Component({
  selector: 'avifaune',
  templateUrl: 'avifaune.html',
})
export class AvifauneComponent extends ProtocolFormComponent {

  ngOnInit() {
    super.ngOnInit(Avifaune);
  }

  getFormModel(model){
        return this.builder.group({
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
      /*this.dateObs =  Date.now();
      this.formModel.value.dateObs = this.dateObs;
      // detect form changes to activate "save current obs"
      this.formModel.valueChanges.subscribe(data => {
        this.formChanged = true;
    })*/
  }
/*
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
  }*/

}
