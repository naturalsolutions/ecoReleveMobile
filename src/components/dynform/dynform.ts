import { Component } from '@angular/core';

/**
 * Generated class for the DynformComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'dyn-form',
  templateUrl: 'dynform.html'
})
export class DynformComponent {

  text: string;

  constructor() {
    console.log('Hello DynformComponent Component');
    this.text = 'Hello World';
  }

}
