import { Component } from '@angular/core';
import {  ViewController } from 'ionic-angular';


@Component({
  template: `
    <div class="popover-help-page">

    <p class="helpTitle">Status de l'observation</p>
    <br/>
    <div>
    <ion-row>
    <div class="iconHelp" style="width:50px; margin:10px;">
        <ion-thumbnail item-start>
            <img src="./assets/icones_obs/flore_progress.png" class="imgHelp"/>
        </ion-thumbnail>
    </div>
    <div class="obsValue">
        <p>Observation en cours d'édition</p>
   </div>

</ion-row>

<ion-row>
<div class="iconHelp" style="width:50px; margin:10px;">
    <ion-thumbnail item-start>
        <img src="./assets/icones_obs/flore.png" class="imgHelp"/>
    </ion-thumbnail>
    </div>
    <div class="obsValue">
    <p>Observation finalisée</p>
    </div>
</ion-row>

<ion-row>
<div class="iconHelp" style="width:50px; margin:10px;">
    <ion-thumbnail item-start>
        <img src="./assets/icones_obs/flore_sync.png" class="imgHelp"/>
    </ion-thumbnail>
    </div>
    <div class="obsValue">
    <p>Observation synchronisée</p>
    </div>
</ion-row>

    </div>

    <button ion-button color="secondary" class="helpBtn" (click)="closePopover()">OK</button>
    
    
    
    </div>
  `
})
export class PopoverHelpPage {

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