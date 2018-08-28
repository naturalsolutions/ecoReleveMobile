
import { Component } from '@angular/core';
import {ProtocolFormComponent } from '../protocol-form/protocol-form';
import { Validators } from '@angular/forms';
import {Flore} from '../../../models/flore-interface';

@Component({
  selector: 'flore',
  templateUrl: 'flore.html'
})
export class FloreComponent extends ProtocolFormComponent {

  ngOnInit() {
    super.ngOnInit(Flore);
  }

  getFormModel(model){
        return this.builder.group({
        'protocole':'Flore',
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
        'type_milieu' : [
          model.type_milieu
        ],
        'abondance_dominance'  : [
           model.abondance_dominance
        ],
        'stade' : [
          model.stade
       ],
        'strate': [
           model.strate
        ],
        'surface' : [
           model.surface
        ],
        'effectif' : [
          model.effectif,
         []
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
