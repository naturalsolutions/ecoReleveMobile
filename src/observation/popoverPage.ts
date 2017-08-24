import { Component, ViewChild, ElementRef } from '@angular/core';

import { PopoverController, NavController,ViewController } from 'ionic-angular';
import { ProtocolsPage } from '../protocols/protocols'

@Component({
  template: `
    <ion-list class="popover-page">
      <ion-item class="text-athelas" (click)="changeProtocol()">
        <ion-label>Nouveau protocole</ion-label>
      </ion-item>
      <ion-item class="text-charter">
        <ion-label>Nouvelle observation</ion-label>
      </ion-item>
      <ion-item class="text-charter">
      <ion-label>Prendre une photo</ion-label>
    </ion-item>
    <ion-item class="text-charter"  (click)="closePopover()">
    <ion-label>Retour</ion-label>
    </ion-item>

    </ion-list>
  `
})
export class PopoverPage {
  parent : any;

  constructor( public navCtrl: NavController,private el: ElementRef,public viewCtrl: ViewController) {

  }

  ngOnInit() {


  }
  getPhoto(){

  }
  changeProtocol(){
    this.viewCtrl.dismiss();
    this.navCtrl.push(ProtocolsPage)
  }
  closePopover(){
    this.viewCtrl.dismiss();
  }

}