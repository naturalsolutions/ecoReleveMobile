import { Component, ViewChild, ElementRef } from '@angular/core';

import { PopoverController, NavController,ViewController, NavParams,AlertController } from 'ionic-angular';
import { ProtocolsPage } from '../protocols/protocols'
import { ObservationsPage } from '../observations/observations'
import {ObsProvider} from '../providers/obs/obs'

@Component({
  template: `
    <ion-list class="popover-page">
      <ion-item class="actionItem" (click)="changeProtocol()">
        <ion-label>Changer le protocole</ion-label>
      </ion-item>
      <ion-item class=""  (click)="deleteObs()">
      <ion-label>Supprimer cette observation</ion-label>
      </ion-item>
      <ion-item class="actionItem" (click)="displayObs()">
        <ion-label>Mes observations</ion-label>
      </ion-item>

    <!--<ion-item class="" (click)="saveObs()">
    <ion-label>Enregistrer</ion-label>
    </ion-item> -->
    <ion-item class="" (click)="closePopover()">
    <ion-label>Retour</ion-label>
    </ion-item>

    </ion-list>
  `
})
export class PopoverPage {
  parent : any;
  private obsId : number;
  private projId : number;
  constructor( 
    public navCtrl: NavController,
    private el: ElementRef,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public data : ObsProvider,
    private alertCtrl: AlertController
  
  ) {
    this.obsId = navParams.data.obsId 
    this.parent  = navParams.data.parent 
    this.projId = navParams.data.projId
  }

  ngOnInit() {


  }
  takePicture(){
    this.parent.takePicture(this.projId,this.obsId);
    this.viewCtrl.dismiss();
  }
  changeProtocol(){
    this.viewCtrl.dismiss();
    //this.navCtrl.push(ProtocolsPage)
    this.parent.navCtrl.pop()
  }
  closePopover(){
    this.viewCtrl.dismiss();
  }
  displayObs(){
    this.viewCtrl.dismiss();
    //this.navCtrl.push(ObservationsPage)
    this.parent.navCtrl.pop()
    this.parent.navCtrl.pop()
  }
  deleteObs(){
    this.viewCtrl.dismiss()
    this.deleteConfirm()
  }
  saveObs(){
    this.parent.onSubmit()
    this.viewCtrl.dismiss()

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
            let data = {"action" : "removeObs", "protoId" :this.obsId  };
            this.dismiss(data)
            this.data.deleteObs(this.obsId)
            this.parent.navCtrl.pop()
          }
        }
      ]
    });
    alert.present();
  }

  dismiss(data) {
    //let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

}