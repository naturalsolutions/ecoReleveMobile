import { Component,ElementRef,Renderer,ViewChild  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController,NavParams,ViewController,Searchbar  } from 'ionic-angular';
import { CompleteTaxaService } from '../../../providers/autocomplete-service';


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
      <i class="js-nomlatin" [class.hide]="true">{{item.taxrefid}}</i>
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
    @ViewChild(Searchbar) searchbar:Searchbar;
    

  constructor( 
    public navCtrl: NavController,
    public completeTaxaService: CompleteTaxaService,

    public viewCtrl: ViewController,
    public navParams: NavParams,
    private elementRef: ElementRef,
    public renderer: Renderer

  
  ) {
    this.searchControl = new FormControl();

    this.protocole = navParams.data.protocole
    

  }

  ngOnInit() {

    //search bar is wrapped with a div so we get the child input
    const searchInput = this.elementRef.nativeElement.querySelector('input');
    setTimeout(() => {
      //delay required or ionic styling gets finicky
     this.renderer.invokeElementMethod(searchInput, 'focus', []);
    }, 200);
    
    



           this.setFilteredItems();
    
           this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
    
               this.searching = false;
               this.setFilteredItems();
    
           });
    
    
    }

    ionViewDidEnter() {
      setTimeout(() => {
        this.searchbar.setFocus();
      });
    }
    setFilteredItems() {
        if(this.searchTerm && (this.searchTerm.length > 2)) {
          this.searching = true;
          this.completeTaxaService.getResults(this.searchTerm, this.protocole).then(data =>{
            this.items = data;
            this.searching = false;
          })
        }
               
        
    }



  onSearchInput(e){
   
    this.setFilteredItems();
}
onCancel(e){
   // this.searching = true;
}
getSelected(e){
  let verna = e.label
  let scientifique = e.latin
  let id = e.taxref_id
  this.viewCtrl.dismiss({
    nom_vernaculaire : verna,
    taxon : scientifique,
    taxref_id : id
  });
}

}