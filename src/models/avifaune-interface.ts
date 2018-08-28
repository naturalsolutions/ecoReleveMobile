interface AvifauneInterface {
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
    code_atlas: string,
    hauteur_vol: string,
    latitude:number,
    longitude: number,
    dateObs: number,
    projId : number,
    Comments : string,
    images : string,
    trace : string,
    taxref_id : number,
    minimum : number
}
export   class Avifaune implements AvifauneInterface {  
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
          public code_atlas ='',
          public hauteur_vol ='',
          public latitude= 0,
          public longitude=0,
          public dateObs =0,
          public projId,
          public Comments ='',
          public images,
          public trace ='',
          public taxref_id=null,
          public minimum 
        ) {
        } 
}