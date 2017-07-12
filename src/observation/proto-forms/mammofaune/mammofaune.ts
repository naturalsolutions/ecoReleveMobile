import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';

/**
 * Generated class for the Protocol1Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'mammofaune', 
  templateUrl: 'mammofaune.html',
})
export class MammofaunePage {
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
          '',
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
  
  onSubmit(formData) {
    //console.log(this.todo)
        if(formData.valid) {
          console.log(formData.value);
        alert('form valide')
    } else {
      alert('form non valide');
      console.log(formData);
    }

  }

}
