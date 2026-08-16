// Base de données des bières.
// Liste de départ volontairement courte : Paul demandera une liste détaillée plus tard.
// Format : { name, style, abv } — abv en % (nombre ou null si inconnu)
const BEERS_DB = [
  { name: "Leffe Blonde", style: "Blonde d'abbaye", abv: 6.6 },
  { name: "Leffe Brune", style: "Brune d'abbaye", abv: 6.5 },
  { name: "Chimay Bleue", style: "Trappiste", abv: 9.0 },
  { name: "Duvel", style: "Blonde forte belge", abv: 8.5 },
  { name: "Heineken", style: "Lager", abv: 5.0 },
  { name: "1664", style: "Lager", abv: 5.5 },
  { name: "Grimbergen Blonde", style: "Blonde d'abbaye", abv: 6.7 },
  { name: "Affligem Blonde", style: "Blonde d'abbaye", abv: 6.8 },
  { name: "Desperados", style: "Lager aromatisée tequila", abv: 5.9 },
  { name: "La Chouffe", style: "Blonde belge", abv: 8.0 },
  { name: "Guinness", style: "Stout", abv: 4.2 },
  { name: "Pelforth Blonde", style: "Blonde", abv: 5.8 },
  { name: "Kronenbourg", style: "Lager", abv: 4.2 },
  { name: "Corona", style: "Lager mexicaine", abv: 4.5 },
  { name: "Delirium Tremens", style: "Blonde forte belge", abv: 8.5 },
];
