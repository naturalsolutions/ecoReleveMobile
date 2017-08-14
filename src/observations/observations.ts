import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ObsProvider} from '../providers/obs/obs';
import { ProtocolsPage } from '../protocols/protocols';
import {ProtocolsServiceProvider} from '../providers/protocols-service';
import { ObservationPage} from '../observation/observation';
import {MapPage} from '../observation/map/map'

@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
  providers : [ProtocolsServiceProvider]
})
export class ObservationsPage {

  private obs :any;
  obsSegment: string= 'listes';
  protocols : any;

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  private data : ObsProvider,
  public protocolsService : ProtocolsServiceProvider
  ) {
    console.log(' obs page constructor')
    this.loadProtocols()
  }

  ionViewDidLoad() {

    
  }
  ionViewDidEnter(){
    console.log(' obs page enter')
    this.obs = this.data.getObs();

  }
  navigateToDetail(protocole,id){
    // get selected protocol
    let protocol = this.protocols.find(x => x.name === protocole);
    console.log(protocol);
    this.navCtrl.push(ObservationPage, {protoObj:protocol, obsId : id});
  }
  newObs(){
    this.navCtrl.push(ProtocolsPage)
  }
  getImage(protocole,finished){
    let src="";
    if(finished){
      switch(protocole) {
          case "avifaune":
              src="avifaune.jpg";
              break;
          case "herpetophaune":
              src="herpeto.jpg";   
              break;
           case "mammophaune":
             src="avifaune.jpg";  //TODO update picto 

          default:
              src="avifaune.jpg";  //TODO update picto 
      }

    } else {
      switch(protocole) {
          case "avifaune":
              src="avifaune_progress.jpg"; //TODO update picto 
              break;
          case "herpetophaune":
              src="avifaune_progress.jpg";   //TODO update picto 
              break;
           case "mammophaune":
             src="avifaune_progress.jpg";  //TODO update picto 

          default:
              src="avifaune_progress.jpg";  //TODO update picto 
      }

    }
    return ('./assets/icones_obs/' + src);
  }
  loadProtocols (){
    this.protocolsService.load()
    .then(data =>{
      this.protocols = data;
    })

  }
}
