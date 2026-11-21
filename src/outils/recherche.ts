// Auteur: Kevin MEYER - 19/11/2026

// Texte en minuscules et sans accents, pour comparer une recherche avec un nom
export function simplifie( texte: string | number | null | undefined ): string
{
  return String( texte ?? "" ).normalize( "NFD" ).replace( /[̀-ͯ]/g, "" ).toLowerCase().trim() ;
}

// Vrai si tous les mots de la recherche sont dans le texte ("hugo victor" trouve "Victor Hugo")
export function correspond( texte: string, recherche: string ): boolean
{
  let simple = simplifie( texte ) ;
  return simplifie( recherche ).split( /\s+/ ).every( mot => simple.includes( mot ) ) ;
}
