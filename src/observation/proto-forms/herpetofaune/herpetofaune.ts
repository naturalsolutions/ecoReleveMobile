import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Herpeto} from '../../../models/herpetofaune-interface';


@Component({
  selector: 'herpetofaune',
  templateUrl: 'herpetofaune.html',
})
export class HerpetofauneComponent extends ProtocolFormComponent {

  ngOnInit() {
    super.ngOnInit(Herpeto);
  }
  getFormModel(model){
       return this.builder.group({
        'protocole':'Herpeto',
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
           'taxref_id' : [
            model.taxref_id
           ]
      });
  }
}
