import { Component } from '@angular/core';

/**
 * Generated class for the ProtocolFormComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'protocol-form',
  templateUrl: 'protocol-form.html'
})
export class ProtocolFormComponent {

  text: string;

  constructor() {
    console.log('Hello ProtocolFormComponent Component');
    this.text = 'Hello World';
  }

}
