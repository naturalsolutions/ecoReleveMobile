import { Injectable }   from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FieldBase } from './field-base';

@Injectable()
export class FieldControlService {
  constructor() { }

  toFormGroup(fields: FieldBase<any>[] ) {
    let group: any = {};

    fields.forEach(field => {
      if(field.controlType!="taxonlist") {
        let val = field.value != null && field.value != undefined ? field.value : '';
        group[field.key] = field.required ? new FormControl(val, Validators.required) : new FormControl(val);
      } else {

        group['taxons'] = new FormGroup({
          'taxon': new FormControl('', Validators.required),
          'number': new FormControl(0 , Validators.required)
        });
      }


      //field.setValue(field.value)
    }
    );
    return new FormGroup(group);
  }
}



