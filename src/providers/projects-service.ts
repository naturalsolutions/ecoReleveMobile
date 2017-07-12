import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectsServiceProvider {
  data:any;

  constructor(public http: Http) {

  }
  load(){
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve =>{
      this.http.get('assets/data/projects.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
        console.log('passed in projects service');
        resolve(this.data);
      });

    });


  }

}
