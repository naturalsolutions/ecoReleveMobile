import { Component,ElementRef,Renderer } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController,NavParams,ViewController } from 'ionic-angular';
import { CompleteTaxaService } from '../../../providers/autocomplete-service';
/*import { Component, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, NavController,ViewController, NavParams,AlertController } from 'ionic-angular';*/


@Component({
    selector: 'page-autocompTaxa',
 template: `

  <ion-header>
  <ion-navbar color="primary">
    <ion-title>
      Recherche d'espèce
    </ion-title>
  </ion-navbar>

  <ion-toolbar no-border-top>
  <ion-searchbar [(ngModel)]="searchTerm" [showCancelButton]="shouldShowCancel" (ionInput)="onSearchInput($event)" (ionCancel)="onCancel($event)">
  </ion-searchbar>
  <div *ngIf="searching" class="spinner-container">
    <ion-spinner></ion-spinner>
  </div>
  </ion-toolbar>
</ion-header>
 
<ion-content>
 

 
    <ion-list>
    <ion-item class="text-center" *ngFor="let item of items" (click)="getSelected(item)">
      <span item-start>
        {{item.Rang}}
      </span>
      {{item.vernaculaire}}
      <br>
      <i class="js-nomlatin">{{item.latin}}</i>
    </ion-item>
  </ion-list>
 
</ion-content>  
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
  let verna = e.label
  let scientifique = e.latin

  this.parent.formModel.value.nom_vernaculaire = verna
  this.parent.formModel.value.nom_scientifique = scientifique

  this.parent.formModel.controls['nom_vernaculaire'].setValue(verna);
  this.parent.formModel.controls['nom_scientifique'].setValue(scientifique);
  this.viewCtrl.dismiss();
}

}