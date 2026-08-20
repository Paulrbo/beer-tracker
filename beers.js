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
      { label: "Bonne Pioche", style: "Blonde", abv: 5.5 },
      { label: "Poule Mouillée", style: "IPA", abv: 6.5 },
      { label: "Pas Cap", style: "Triple", abv: 8.0 },
      { label: "Prem's", style: "Pils", abv: 4.5 },
      { label: "Coup de Soleil", style: "IPA", abv: 7.5 },
      { label: "Pin Pon", style: "Blonde", abv: 7.0 },
      { label: "Looping", style: "Blonde", abv: 4.0 },
      { label: "Fauteuse de Troubles", style: "NEIPA", abv: 6.0 },
      { label: "Même Pas Mal", style: "Sans Alcool", abv: 0.5 },
    ],
  },
  {
    brand: "Jenlain",
    variants: [
      { label: "Ambrée", style: "Ambrée", abv: 7.5 },
      { label: "Blonde", style: "Blonde", abv: 6.5 },
    ],
  },
  {
    brand: "3 Monts",
    variants: [
    { label: "Blonde", style: "Blonde", abv: 8.5 },
    { label: "IPA", style: "IPA", abv: 5.6 },
    { label: "Ambrée", style: "Ambrée", abv: 9.5 },
    { label: "Triple", style: "Triple", abv: 7.5 },
    { label: "Saison", style: "Saison", abv: 6.5 },
    { label: "Chapelle", style: "Blonde", abv: 6.5 },
    ],
  },
  {
    brand: "Ch'ti",
    variants: [
      { label: "Ch'ti Blonde", style: "Blonde", abv: 6.4 },
      { label: "Ch'ti Ambrée", style: "Ambrée", abv: 5.9 },
      { label: "Ch'ti Brune", style: "Brune", abv: 6.5 },
      { label: "Ch'ti Triple", style: "Triple", abv: 8.0 },
    ],
  },
  {
    brand: "Anosteké",
    variants: [
    { label: "Anosteké Blonde", style: "Blonde", abv: 8.0 },
    { label: "Anosteké IPA", style: "IPA", abv: 6.0 },
    { label: "Anosteké Extra Stout", style: "Brune", abv: 8.5 },
    { label: "Anosteké NEIPA", style: "NEIPA", abv: 5.6 },
    { label: "Anosteké Prestige", style: "Triple", abv: 8.0 },
    ],
  },
  {
    brand: "Choulette",
    variants: [
      { label: "Ambrée", style: "Ambrée", abv: 7.5 },
      { label: "Framboise", style: "Rouge", abv: 4.5 },
    ],
  },
  {
    brand: "Thiriez",
    variants: [
      { label: "Blonde d'Esquelbecq", style: "Blonde", abv: 4.5 },
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
      { label: "Blonde", style: "Blonde", abv: 6.6 },
      { label: "Brune", style: "Brune", abv: 6.5 },
    ],
  },
  {
    brand: "Chimay",
    variants: [
      { label: "Jaune", style: "Blonde", abv: 6.5 },
      { label: "Triple", style: "Triple", abv: 8.0 },
      { label: "Bleue", style: "Brune", abv: 9.0 },
      { label: "Rouge", style: "Brune", abv: 7.0 },
      { label: "Verte", style: "Blonde", abv: 10.0 },
      { label: "Dorée", style: "Blonde", abv: 4.8 },
    ],
  },
  {
    brand: "1664",
    variants: [
      { label: "Blonde", style: "Pils", abv: 5.5 },
      { label: "Blanc", style: "Blanche", abv: 5.0 },
      { label: "Rosé", style: "Rouge", abv: 4.5 },
      { label: "0.0%", style: "Brune", abv: 0.0 },
    ],
  },

  { brand: "Duvel", variants: [{ label: null, style: "Blonde", abv: 8.5 }] },
  { brand: "Heineken", variants: [{ label: null, style: "Pils", abv: 5.0 }] },
  { brand: "Grimbergen", variants: [{ label: "Blonde", style: "Blonde", abv: 6.7 }] },
  { brand: "Affligem", variants: [{ label: "Blonde", style: "Blonde", abv: 6.8 }] },
  { brand: "Desperados", variants: [{ label: null, style: "Lager mexicaine", abv: 5.9 }] },
  { brand: "La Chouffe", variants: [{ label: null, style: "Blonde", abv: 8.0 }] },
  { brand: "Guinness", variants: [{ label: null, style: "Brune", abv: 4.2 }] },
  { brand: "Kronenbourg", variants: [{ label: null, style: "Pils", abv: 4.2 }] },
  { brand: "Corona", variants: [{ label: null, style: "Lager mexicaine", abv: 4.5 }] },
  { brand: "Delirium Tremens", variants: [{ label: null, style: "Blonde", abv: 8.5 }] },
];
