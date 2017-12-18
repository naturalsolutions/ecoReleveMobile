//import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import {config }  from '../config';

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
      let url = config.serverUrl;
    
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
            this.http.get(url + "ecoReleve-Core/autocomplete/taxon?type=vernaculaire&term="+item + "&protocol=" + proto)
            .map(res => res.json())
            .subscribe(data => {
              resolve(data);
            },
            err => {
                //reject(err);
                resolve([]);
            });
      
          });
      }
}
