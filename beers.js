// Base de données des bières, groupées par marque.
// Chaque marque a un tableau "variants" : une seule entrée (label: null) pour
// les marques sans déclinaison, plusieurs entrées sinon (ex. Tandem, Ch'ti).
// Les degrés sont vérifiés via les fiches brasseurs quand possible ; pour les
// petites brasseries artisanales certains chiffres sont des valeurs usuelles
// du millésime standard (les brassins éphémères varient). Tout est éditable.
const BEERS_DB = [
  {
    brand: "Tandem",
    variants: [
      { label: "Bonne Pioche", style: "Pale Ale blonde bio", abv: 5.5 },
      { label: "Poule Mouillée", style: "IPA bio", abv: 6.5 },
      { label: "Pas Cap", style: "Triple bio", abv: 8.0 },
      { label: "Prem's", style: "Lager bio", abv: 4.5 },
      { label: "Coup de Soleil", style: "Double IPA", abv: 7.5 },
      { label: "Pin Pon", style: "Saison / Golden Ale", abv: 7.0 },
      { label: "Looping", style: "Session Pale Ale", abv: 4.0 },
      { label: "Fauteuse de Troubles", style: "New England IPA (NEIPA)", abv: 6.0 },
      { label: "Même Pas Mal", style: "Blonde sans alcool", abv: 0.5 },
    ],
  },
  {
    brand: "Jenlain",
    variants: [
      { label: "Ambrée", style: "Bière de garde ambrée", abv: 7.5 },
      { label: "Blonde", style: "Bière de garde blonde", abv: 6.5 },
    ],
  },
  {
    brand: "3 Monts",
    variants: [{ label: null, style: "Bière de garde de Flandre", abv: 8.5 }],
  },
  {
    brand: "Ch'ti",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.4 },
      { label: "Ambrée", style: "Ambrée", abv: 5.9 },
      { label: "Brune", style: "Brune", abv: 6.5 },
      { label: "Triple", style: "Triple", abv: 8.0 },
    ],
  },
  {
    brand: "Anosteké",
    variants: [{ label: "Blonde", style: "Belgian Strong Golden Ale", abv: 8.0 }],
  },
  {
    brand: "La Choulette",
    variants: [
      { label: "Ambrée", style: "Bière de garde", abv: 7.5 },
      { label: "Framboise", style: "Bière de garde aux fruits", abv: 4.5 },
    ],
  },
  {
    brand: "Thiriez",
    variants: [
      { label: "Blonde d'Esquelbecq", style: "Blonde de fermentation haute", abv: 4.5 },
      { label: "Ambrée d'Esquelbecq", style: "Ambrée", abv: 5.5 },
    ],
  },
  {
    brand: "Pelforth",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 5.8 },
      { label: "Brune", style: "Brune", abv: 6.5 },
    ],
  },
  {
    brand: "Leffe",
    variants: [
      { label: "Blonde", style: "Blonde d'abbaye", abv: 6.6 },
      { label: "Brune", style: "Brune d'abbaye", abv: 6.5 },
    ],
  },
  { brand: "Chimay", variants: [{ label: "Bleue", style: "Trappiste", abv: 9.0 }] },
  { brand: "Duvel", variants: [{ label: null, style: "Blonde forte belge", abv: 8.5 }] },
  { brand: "Heineken", variants: [{ label: null, style: "Lager", abv: 5.0 }] },
  { brand: "1664", variants: [{ label: null, style: "Lager", abv: 5.5 }] },
  { brand: "Grimbergen", variants: [{ label: "Blonde", style: "Blonde d'abbaye", abv: 6.7 }] },
  { brand: "Affligem", variants: [{ label: "Blonde", style: "Blonde d'abbaye", abv: 6.8 }] },
  { brand: "Desperados", variants: [{ label: null, style: "Lager aromatisée tequila", abv: 5.9 }] },
  { brand: "La Chouffe", variants: [{ label: null, style: "Blonde belge", abv: 8.0 }] },
  { brand: "Guinness", variants: [{ label: null, style: "Stout", abv: 4.2 }] },
  { brand: "Kronenbourg", variants: [{ label: null, style: "Lager", abv: 4.2 }] },
  { brand: "Corona", variants: [{ label: null, style: "Lager mexicaine", abv: 4.5 }] },
  { brand: "Delirium Tremens", variants: [{ label: null, style: "Blonde forte belge", abv: 8.5 }] },
];
