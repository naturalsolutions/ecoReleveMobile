import { Component } from '@angular/core';
import {  ViewController } from 'ionic-angular';


@Component({
  template: `
    <div class="popover-help-page">

    <p class="helpTitle">Données du projet</p>
    <br/>
    <div>
    <ion-row>
    <div class="iconHelp" style="width:50px; margin:10px;">
        <ion-thumbnail item-start>
            <img src="./assets/icones_projects/synchro.png" class="imgHelp"/>
        </ion-thumbnail>
    </div>
    <div class="obsValue">
        <p>Synchronisées (envoyées au serveur)</p>
   </div>

</ion-row>

<ion-row>
<div class="iconHelp" style="width:50px; margin:10px;">
    <ion-thumbnail item-start>
        <img src="./assets/icones_projects/pas_synchro.png" class="imgHelp"/>
    </ion-thumbnail>
    </div>
    <div class="obsValue">
    <p>Pas encore synchronisées</p>
    </div>
</ion-row>

    </div>

    <button ion-button color="secondary" class="helpBtn" (click)="closePopover()">OK</button>
    
    
    
    </div>
  `
})
export class PopoverHelpProj {

  constructor( 
    public viewCtrl: ViewController,
  
  ) {

  }

  ngOnInit() {

  }
  closePopover(){
    this.viewCtrl.dismiss();
  }

}