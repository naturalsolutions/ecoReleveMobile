
import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Insectes} from '../../../models/insectes-interface';

@Component({
  selector: 'insectes',
  templateUrl: 'insectes.html'
})
export class  InsectesComponent extends ProtocolFormComponent {

  ngOnInit() {
    super.ngOnInit(Insectes);
  }

  getFormModel(model){
        return this.builder.group({
        'protocole':'Insectes',
        'type_inventaire': [
          model.type_inventaire, // default value
          [Validators.required]
        ],
        'nom_vernaculaire': [
           model.nom_vernaculaire
        ],
        'taxon': [
          model.taxon,
          [Validators.required]
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
        'plante_hote': [
           model.plante_hote
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
           ],
           'minimum' : [
            model.minimum
          ]
      });
  }
}
