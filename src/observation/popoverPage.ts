import { Component, ViewChild, ElementRef } from '@angular/core';

import { PopoverController, NavController,ViewController, NavParams,AlertController } from 'ionic-angular';
import { ProtocolsPage } from '../protocols/protocols'
import { ObservationsPage } from '../observations/observations'
import {ObsProvider} from '../providers/obs/obs'

@Component({
  template: `
    <ion-list class="popover-page">
      <ion-item class="actionItem" (click)="changeProtocol()">
        <ion-label>Nouvelle observation</ion-label>
      </ion-item>
      <ion-item class="" (click)="displayObs()">
        <ion-label>Mes observations</ion-label>
      </ion-item>
      <ion-item class="actionItem">
      <ion-label>Prendre une photo</ion-label>
    </ion-item>
    <!--<ion-item class=""  (click)="deleteObs()">
    <ion-label>Supprimer cette observation</ion-label>
    </ion-item>-->
    <ion-item class="actionItem" (click)="closePopover()">
    <ion-label>Retour</ion-label>
    </ion-item>

    </ion-list>
  `
})
export class PopoverPage {
  parent : any;
  private obsId : number
  constructor( 
    public navCtrl: NavController,
    private el: ElementRef,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public data : ObsProvider,
    private alertCtrl: AlertController
  
  ) {
    this.obsId = navParams.data.obsId 
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
  displayObs(){
    this.viewCtrl.dismiss();
    this.navCtrl.push(ObservationsPage)
  }
  deleteObs(){
    this.viewCtrl.dismiss()
    this.deleteConfirm()
  }
  deleteConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Suppression d\'observation',
      message: 'Etes vous sur(e) de supprimer cette observation?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.viewCtrl.dismiss()
            this.data.deleteObs(this.obsId)
            this.navCtrl.push(ObservationsPage)
          }
        }
      ]
    });
    alert.present();
  }

}