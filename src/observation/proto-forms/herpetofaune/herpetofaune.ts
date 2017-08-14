import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import {MapPage} from '../../map/map';
import { ObservationsPage } from '../../../observations/observations';
import {ObsProvider} from '../../../providers/obs/obs';
import {Herpeto} from '../../../models/herpetofaune-interface';

@IonicPage()
@Component({
  selector: 'herpetofaune',
  templateUrl: 'herpetofaune.html',
})
export class HerpetofaunePage {
@Input('segment') segment: string;
@Input() obsId: number;
public formModel: FormGroup;
public dateObs : any;
public latitude: any;
public longitude: any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams ,
     private  builder: FormBuilder,
    private data : ObsProvider
    ) {
  }

  ngOnInit() {
       let herpeto 
      // update existing obs
      if(this.obsId){
        herpeto = new Herpeto(this.obsId)
        this.data.getObsById(this.obsId).then((obs)=>{
           for(var key in obs) {
              herpeto[key] = obs[key];
          }
            this.buildForm(herpeto)
        });

      } else {
        herpeto = new Herpeto(null)
        this.buildForm(herpeto)
      }
  }
  buildForm(model){
        this.formModel = this.builder.group({
        'protocole':'herpetofaune',
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
        'reproduction' : [
           model.reproduction
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
  }

  onSubmit(value) {
    if (!this.formModel.invalid) {
        value.finished = true;

        // set date value
        value.dateObs = this.dateObs;
        // set latitude & longitude
        value.latitude = this.latitude;
        value.longitude = this.longitude;
        // set id value if exists 
        if(this.obsId){
            this.formModel.value.id = this.obsId;
        }
        this.data.saveObs(value);
        this.navCtrl.push(ObservationsPage)
    }
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

}
