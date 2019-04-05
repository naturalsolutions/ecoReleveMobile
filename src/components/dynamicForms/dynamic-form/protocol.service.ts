import { Injectable }       from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FieldBase }     from './field-base';
import { TextField }  from './field-text';
import { NumberField }  from './field-number';
import { SelectField } from './field-select';
import { AutocompField} from './field-autocomplete';
import {CheckboxField} from './field-checkbox';
import {RadioField} from './field-radio';
import {DateField} from './field-date';
import {TimeField} from './field-time';
import {ToggleField} from './field-toggle'
import {Taxonlist} from './field-taxonList'



@Injectable()
export class FieldService {

  constructor(public http: Http) {
   
  }

  loadProtocols(id){
    return new Promise(resolve =>{
      this.http.get('assets/data/protocols.json')
      .map(res => res.json())
      .subscribe(data => {
        let protocolObj =  data.find(i => i.id === id);
        let fields = this.generateProtocols(protocolObj);
        resolve(fields);
      });

    });
  }
  generateProtocols(data){
    let fieldsTab: FieldBase<any>[] = [];

    let fields = data.fields;
    fields.forEach(function (field) {
      let fieldtype = field.type ; 
      let formFied ; 
      switch(fieldtype) {
        case "text":
        formFied = new TextField({
        });
            break;
        case "select":
        formFied = new SelectField({
          options: field.options 
        });
            break;
        case "number":
            formFied = new NumberField({
            });
            break;
        case "checkbox" :
            formFied = new CheckboxField({
             });
            break;
        case "radio" :
            formFied = new RadioField({
              options: field.options 
            });
          break;
          case "toggle" :
          formFied = new ToggleField({
            options: field.options 
          });
        break;
        case "autocomplete" :
            formFied = new AutocompField({
            });
            formFied.searchField = field.searchField
            // table name in sqlite database for this protocol
            formFied.protocol = field.protocol
            break;
        case "date" :
        formFied = new DateField({
        });
        break;

        case "time" :
        formFied = new TimeField({
        });
        break;

        case "taxonlist":
        formFied = new Taxonlist({
          options: field.options 
        });
        break;
    }
    formFied.key = field.key;
    formFied.label = field.label;
    formFied.order = field.order;
    formFied.required = field.required;
    formFied.hide = field.hide;
    formFied.options = field.options || '';
    formFied.value = field.value ;
    console.log(formFied)



    fieldsTab.push(formFied);
    }); 
    return fieldsTab.sort((a, b) => a.order - b.order);

  }
}
