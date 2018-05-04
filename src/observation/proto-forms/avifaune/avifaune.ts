
import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Avifaune} from '../../../models/avifaune-interface';

@Component({
  selector: 'avifaune',
  templateUrl: 'avifaune.html'
})
export class AvifauneComponent extends ProtocolFormComponent {

  ngOnInit() {
    super.ngOnInit(Avifaune);
  }

  getFormModel(model){
        return this.builder.group({
        'protocole':'Avifaune',
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
          ],
          'Comments' : [
            model.Comments
           ],
           'images' : [
            model.images
           ],
           'trace' : [
            model.trace
           ],
           'taxref_id' : [
            model.taxref_id
           ]
      });
  }
}
