import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

/*
  Generated class for the PostsDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class PostsDataProvider {
  rootUrl: string = "https://jsonplaceholder.typicode.com";
  posts : string ="posts";

  constructor(public http: Http) {
    console.log('Hello PostsDataProvider Provider');
  }
  getPosts(){
    return this.http.get(`${this.rootUrl}/${this.posts}`).map(res =>res.json()).take(1)
  }
  getPostById(id:number){
    console.log('pass :' + id)
    return this.http.get(`${this.rootUrl}/${this.posts}/${id}`).map(res =>res.json()).take(1)

  }

}
