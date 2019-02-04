import { Component, Input} from '@angular/core';
import { ModalController} from 'ionic-angular';
import { FormGroup }        from '@angular/forms';
import {PopoverAutocompPage} from'./popoverAutocompPage'

import { FieldBase }     from './field-base';

@Component({
  selector: 'app-field',
  templateUrl: './dynamic-form-field-component.html',
  //styleUrls: ['../dynamic-form-field.component.css']
  styles: ['.contentRadio { height: 100px;}']
})
export class DynamicFormFieldComponent {
  @Input() field: FieldBase<any>;
  @Input() form: FormGroup;
  constructor(
    private modalCtrl: ModalController,

  ) {

  }
  get isValid() { 
    let returnVal = false
    if(this.form.controls[this.field.key] && this.form.controls[this.field.key].valid) {
      returnVal = this.form.controls[this.field.key].valid;
    }
    return returnVal
  
  }
  presentPopoverAutocomp(name){
    //this.form.controls['nom_verna'].setValue('test');
    if(this.form.controls['taxon']){
      this.form.controls['taxon'].setValue('');
    }
    if(this.form.controls['nom_vernaculaire']){
      this.form.controls['nom_vernaculaire'].setValue('');
    }

    
    let popover = this.modalCtrl.create(PopoverAutocompPage, { protocole : this.field['protocol'], searchField : this.field['searchField']},{cssClass: 'autocomp'});
    popover.onDidDismiss(data => {
      console.log(data);
      this.form.patchValue(data);
    })    
    popover.present();
  }
  removeTaxon(i){

  }
}
