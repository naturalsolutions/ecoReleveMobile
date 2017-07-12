import { Component } from '@angular/core';
//import { Validators } from '@angular/common';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-observation',
  templateUrl: 'observation.html',
})


export class ObservationPage  {
  protocol : any;
  protocolName : any;
  segment: string= 'obligatoire';
  title: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.protocol = navParams.data.protoObj;
    this.protocolName = this.protocol.name;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationPage');
    console.log(this);
  }
   ionViewDidEnter() {
    this.title = this.protocolName;
  }

  onSubmit(value) {
    //console.log(this.todo)
    alert('submit');
  }
  ngOnInit() {
      console.log('pass');
  }

}
