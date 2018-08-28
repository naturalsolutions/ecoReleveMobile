import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Mammo} from '../../../models/mammofaune-interface';


@Component({
  selector: 'mammofaune', 
  templateUrl: 'mammofaune.html',
})
export class MammofauneComponent  extends ProtocolFormComponent{

  ngOnInit() {
    super.ngOnInit(Mammo);
  }

    getFormModel(model){
        return this.builder.group({
        'protocole':'Mammo',
        'type_inventaire': [
          model.type_inventaire, // default value
          [Validators.required]
        ],
        'nom_vernaculaire': [
           model.nom_vernaculaire,
          [Validators.required]
        ],
        'taxon': [
          model.taxon,
         []
       ],
       'taxref_id' :    
        [
          model.taxref_id,
        []
      ],
        'effectif' : [
           model.effectif,
          [Validators.required]
        ],
        'estimated' : [
          model.estimated,
         []
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
          ],
          'Comments' : [
            model.Comments
           ],
           'images' : [
            model.images
           ],
           'minimum' : [
             model.minimum
           ]
      });
  }
}
