interface AvifauneInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
   nom_scientifique: string,
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
    remarques : string,
    images : string
}
export   class Avifaune implements AvifauneInterface {  
        constructor(
          public id: number, 
          public protocole ='',
          public type_inventaire ='',
          public nom_vernaculaire ='',
          public nom_scientifique ='',
          public effectif=null,
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
          public remarques ='',
          public images
        ) {
        } 
}