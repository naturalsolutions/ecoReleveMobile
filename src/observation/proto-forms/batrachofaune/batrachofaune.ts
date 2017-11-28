import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Batrachofaune} from '../../../models/batrachofaune-interface';

@Component({
  selector: 'batrachofaune',
  templateUrl: 'batrachofaune.html'
})
export class BatrachofauneComponent extends ProtocolFormComponent {

   ngOnInit() {
      super.ngOnInit(Batrachofaune);

   }
  getFormModel(model){
         return  this.builder.group({
        'protocole':'Batracho',
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
  }


}
