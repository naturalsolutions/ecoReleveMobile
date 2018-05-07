interface InsectesInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
    taxon: string,
    effectif: number,
    estimated : number,
    type_milieu: string,
    comportement: string,
    sexe: string,
    reproduction: string,
    plante_hote: string,
    latitude:number,
    longitude: number,
    dateObs: number,
    projId : number,
    Comments : string,
    images : string,
    taxref_id : number
}
export   class Insectes implements InsectesInterface {  
        constructor(
          public id: number, 
          public protocole ='',
          public type_inventaire ='',
          public nom_vernaculaire ='',
          public taxon ='',
          public effectif=1,
          public estimated = 0,
          public type_milieu ='',
          public comportement ='',
          public sexe ='',
          public reproduction ='',
          public plante_hote ='',
          public latitude= 0,
          public longitude=0,
          public dateObs =0,
          public projId,
          public Comments ='',
          public images,
          public taxref_id=null
        ) {
        } 
}