import { Component,ElementRef,Renderer } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController,NavParams,ViewController } from 'ionic-angular';
import { CompleteTaxaService } from '../../../providers/autocomplete-service';
/*import { Component, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, NavController,ViewController, NavParams,AlertController } from 'ionic-angular';*/


@Component({
    selector: 'page-autocompTaxa',
 template: `
<div class="autocomp">
  <ion-searchbar [(ngModel)]="searchTerm" [showCancelButton]="shouldShowCancel" (ionInput)="onSearchInput($event)" (ionCancel)="onCancel($event)">
  </ion-searchbar>
  <div *ngIf="searching" class="spinner-container">
    <ion-spinner></ion-spinner>
  </div>

  <ion-list>
    <ion-item class="text-center" *ngFor="let item of items" (click)="getSelected($event)">
      <span item-start>
        {{item.Rang}}
      </span>
      {{item.latin}}
      <br/>
      <i class="js-vernaculaire">{{item.vernaculaire}}</i>
    </ion-item>
  </ion-list>
</div>



  <!--
  
  <ion-header>
  <ion-navbar color="primary">
    <ion-title>
      Recherche d'espèce
    </ion-title>
  </ion-navbar>
</ion-header>
 
<ion-content>
 
    <ion-searchbar [(ngModel)]="searchTerm" [formControl]="searchControl" (ionInput)="onSearchInput()"></ion-searchbar>
 
    <div *ngIf="searching" class="spinner-container">
        <ion-spinner></ion-spinner>
    </div>
 
    <ion-list>
        <ion-item *ngFor="let item of items">
            {{item.name}}
        </ion-item>
    </ion-list>
 
</ion-content>  -->
  `,
  providers : [
    CompleteTaxaService
  ]
})
export class PopoverAutocompPage {
    searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    searching: any = false;
    protocole : any;
  
  
    parent : any;

  constructor( 
    public navCtrl: NavController,
    public completeTaxaService: CompleteTaxaService,
    //private el: ElementRef,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private elementRef: ElementRef,
    public renderer: Renderer
   // public data : ObsProvider,
   // private alertCtrl: AlertController
  
  ) {
    this.searchControl = new FormControl();
    this.parent  = navParams.data.parent
    this.protocole = navParams.data.protocole

  }

  ngOnInit() {

    //search bar is wrapped with a div so we get the child input
    const searchInput = this.elementRef.nativeElement.querySelector('input');
    setTimeout(() => {
      //delay required or ionic styling gets finicky
      this.renderer.invokeElementMethod(searchInput, 'focus', []);
    }, 100);
    




           this.setFilteredItems();
    
           this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
    
               this.searching = false;
               this.setFilteredItems();
    
           });
    
    
       }
    setFilteredItems() {
        if(this.searchTerm && (this.searchTerm.length > 2)) {
          this.completeTaxaService.getResults(this.searchTerm, this.protocole).then(data =>{
            this.items = data;
            this.searching = false;
          })
        }
               
        
    }
 /* deleteConfirm() {
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
  }*/


  onSearchInput(e){
    this.searching = true;
    this.setFilteredItems();
    /*this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      
                 this.searching = false;
                 this.setFilteredItems();
      
             });*/
}
onCancel(e){
   // this.searching = true;
}
getSelected(e){
  console.log(e.target.innerText)
  this.parent.formModel.value.nom_vernaculaire = e.target.innerText
  this.parent.formModel.controls['nom_vernaculaire'].setValue(e.target.innerText);
  this.viewCtrl.dismiss();
}

}