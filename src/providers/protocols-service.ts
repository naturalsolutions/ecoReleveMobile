import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProtocolsServiceProvider {
  data:any;

  constructor(public http: Http) {
    console.log('Hello ProtocolsServiceProvider Provider');
  }
  load(){
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve =>{
      this.http.get('assets/data/protocols.json')
      .map(res => res.json())
      .subscribe(data => {
        console.log('projets chargés');
        this.data = data;
        resolve(this.data);
      });

    });


  }

}
