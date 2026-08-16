// Base de données des bières.
// Format : { name, style, abv } — abv en % (nombre ou null si inconnu)
// Les degrés sont vérifiés via les fiches brasseurs quand possible ; pour les
// petites brasseries artisanales certains chiffres sont des valeurs usuelles
// du millésime standard (les brassins éphémères varient). Tout est éditable
// à la volée depuis l'app si besoin d'ajuster.
const BEERS_DB = [
  // ---------- Brasserie Tandem (Wambrechies) — gamme permanente ----------
  { name: "Tandem Bonne Pioche", style: "Pale Ale blonde bio", abv: 5.5 },
  { name: "Tandem Poule Mouillée", style: "IPA bio", abv: 6.5 },
  { name: "Tandem Pas Cap", style: "Triple bio", abv: 8.0 },
  { name: "Tandem Prem's", style: "Lager bio", abv: 4.5 },
  { name: "Tandem Coup de Soleil", style: "Double IPA", abv: 7.5 },
  { name: "Tandem Pin Pon", style: "Saison / Golden Ale", abv: 7.0 },
  { name: "Tandem Looping", style: "Session Pale Ale", abv: 4.0 },
  { name: "Tandem Fauteuse de Troubles", style: "New England IPA (NEIPA)", abv: 6.0 },
  { name: "Tandem Même Pas Mal", style: "Blonde sans alcool", abv: 0.5 },

  // ---------- Grands classiques Nord / Hauts-de-France ----------
  { name: "Jenlain Ambrée", style: "Bière de garde ambrée", abv: 7.5 },
  { name: "Jenlain Blonde", style: "Bière de garde blonde", abv: 6.5 },
  { name: "3 Monts", style: "Bière de garde de Flandre", abv: 8.5 },
  { name: "Ch'ti Blonde", style: "Blonde", abv: 6.4 },
  { name: "Ch'ti Ambrée", style: "Ambrée", abv: 5.9 },
  { name: "Ch'ti Brune", style: "Brune", abv: 6.5 },
  { name: "Ch'ti Triple", style: "Triple", abv: 8.0 },
  { name: "Anosteké Blonde", style: "Belgian Strong Golden Ale", abv: 8.0 },
  { name: "La Choulette Ambrée", style: "Bière de garde", abv: 7.5 },
  { name: "La Choulette Framboise", style: "Bière de garde aux fruits", abv: 4.5 },
  { name: "Thiriez Blonde d'Esquelbecq", style: "Blonde de fermentation haute", abv: 4.5 },
  { name: "Thiriez Ambrée d'Esquelbecq", style: "Ambrée", abv: 5.5 },
  { name: "Pelforth Blonde", style: "Blonde", abv: 5.8 },
  { name: "Pelforth Brune", style: "Brune", abv: 6.5 },

  // ---------- Autres classiques belges / internationaux ----------
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
  { name: "Kronenbourg", style: "Lager", abv: 4.2 },
  { name: "Corona", style: "Lager mexicaine", abv: 4.5 },
  { name: "Delirium Tremens", style: "Blonde forte belge", abv: 8.5 },
];
