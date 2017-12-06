//import {AutoCompleteService} from 'ionic2-auto-complete';
import { Http } from '@angular/http';
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class CompleteTaxaService {
  //labelAttribute = "name";
  items: any;
  protocole : any;
  constructor(
    private http:Http,
    private sqlite : SQLite
  ) {
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
    var _that = this;
        let tableName ;
        switch(protocole) {
          case 'avifaune':
          tableName = 'Bird'
              break;
          case 'batrachofaune':
          tableName = 'Amphibia'
              break;
          case 'herpetofaune':
          tableName = 'Reptil'
                  break;
          case 'mammofaune':
          tableName = 'Mammal'
            break;
          case 'insect' :
          tableName = 'Insect'
          default:
                 'avifaune'
      }

          return new Promise((resolve , reject) =>{

              _that.sqlite.create({
                name: 'Sydoni.db',
                location: 'default'
              })
                .then((db: SQLiteObject) => { 
                  console.log('open SQL');
                  db.executeSql('SELECT CD_NOM AS taxref_id, NOM_VERN AS label, NOM_VERN AS vernaculaire, LB_NOM AS latin, RANG AS Rang FROM '+tableName+' WHERE LB_NOM LIKE "%'+item+'%" ORDER BY LB_NOM ASC', {})
                    .then((res) => {
                      db.close();
                      var data = []
                      for (var i =0 ; i < res.rows.length ; i++ ) {
                        data.push (res.rows.item(i));
                      }
                      resolve(data)
                    }
                  )
                  .catch(e => {
                    db.close();
                    resolve([]);
                    console.log(e);
                  });
                })
      
          });
      }
}
Lacerta vivipara vivipara
Lacerta vivipara pannonica