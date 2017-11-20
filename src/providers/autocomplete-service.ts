//import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'

@Injectable()
export class CompleteTaxaService {
  //labelAttribute = "name";
  items: any;
  protocole : any;
  constructor(private http:Http) {
    this.items = [
      {title: 'one'},
      {title: 'two'},
      {title: 'three'},
      {title: 'four'},
      {title: 'five'},
      {title: 'six'}
  ]
  }
  getResults(item:string, protocole) {
   /* return this.items.filter((item) => {
      return item.title.indexOf(item) > -1;
  }); */
    
    //return this.http.get("https://restcountries.eu/rest/v1/name/"+item)
    /*return this.http.get("http://vps471185.ovh.net/ecoReleve-Core/autocomplete/taxon?protocol=insecte&type=vernaculaire&term="+item)
      .map(
        result =>
        {
          return result.json()
            .filter(item => item.vernaculaire.toLowerCase().startsWith(item.toLowerCase()) )
        });*/
        let proto ;
        switch(protocole) {
          case 'avifaune':
          proto = 'oiseau'
              break;
          case 'batrachofaune':
          proto = 'amphibien'
              break;
          case 'herpetofaune':
          proto = 'reptile'
                  break;
          case 'mammofaune':
            proto = 'mammal'
            break;
          default:
                 'avifaune'
      }
      /*  valeurs de proto :
      reptile
      oiseau
      amphibien
      mammal
      insecte
      chiroptera  */

          return new Promise((resolve , reject) =>{
            //this.http.get('assets/data/projects.json')
            this.http.get("http://vps471185.ovh.net/ecoReleve-Core/autocomplete/taxon?type=vernaculaire&term="+item + "&protocol=" + proto)
            .map(res => res.json())
            .subscribe(data => {
              console.log('****data from ovh********');
              
              resolve(data);
            },
            err => {
                //reject(err);
                resolve([]);
            });
      
          });
      }
}
