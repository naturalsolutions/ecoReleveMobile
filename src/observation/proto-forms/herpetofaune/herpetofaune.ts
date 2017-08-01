import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import {MapPage} from '../../map/map'


@IonicPage()
@Component({
  selector: 'herpetofaune',
  templateUrl: 'herpetofaune.html',
})
export class HerpetofaunePage {
@Input('segment') segment: string;
public formModel: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams ,private  builder: FormBuilder) {
  }

  ngOnInit() {
    
    this.formModel = this.builder.group({
        'type_inventaire': [
          '', // default value
          [Validators.required]
        ],
        'nom_vernaculaire': [
          'test',
          [Validators.required]
        ],
        'effectif' : [
          '',
          [Validators.required]
        ],
        'type_milieu' : [''],
        'comportement'  : [''],
        'sexe': [''],
        'reproduction' : ['']
      });
  }

  onSubmit(value) {
    //console.log(this.todo)
    alert('submit');
  }

}
