
import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Chiropteres} from '../../../models/chiropteres-interface';

@Component({
  selector: 'chiropteres',
  templateUrl: 'chiropteres.html'
})
export class ChiropteresComponent extends ProtocolFormComponent {

  ngOnInit() {
    super.ngOnInit(Chiropteres);
  }

  getFormModel(model){
        return this.builder.group({
        'protocole':'Chiropteres',
        'type_inventaire': [
          model.type_inventaire, // default value
          [Validators.required]
        ],
        'nom_vernaculaire': [
           model.nom_vernaculaire,
          [Validators.required]
        ],
        'nom_scientifique': [
          model.nom_scientifique,
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
        'nb_contact': [
            model.nb_contact,
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
        'hauteur_detection': [
           model.hauteur_detection
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
           'taxref_id' : [
            model.taxref_id
           ]
      });
  }
}
