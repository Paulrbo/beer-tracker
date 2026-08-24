// Base de données des bières, groupées par marque.
// Chaque marque a un tableau "variants" : une seule entrée (label: null) pour
// les marques sans déclinaison, plusieurs entrées sinon (ex. Tandem, Ch'ti).
//
// IMPORTANT : "label" ne doit JAMAIS répéter le nom de la marque (le nom
// affiché est reconstruit ailleurs en combinant brand + label).
//
// "style" est strictement limité à 12 catégories fixes :
// Blonde, Triple, Pils, Rouge, IPA, NEIPA, Brune, Ambrée,
// Aromatisée, Blanche, Sans Alcool.
// Un style de base "absorbe" dans la catégorie la plus proche quand il n'a
// pas de case dédiée (ex. Saison -> Blonde, Stout -> Brune, Dubbel -> Brune,
// bière de garde ambrée -> Ambrée). Toute bière à 0%/0.0% passe en
// "Sans Alcool" quel que soit son style de base.
//
// Degrés vérifiés via les fiches brasseurs/sites officiels quand possible ;
// pour certaines petites brasseries artisanales ou déclinaisons sans fiche
// publique, ce sont des valeurs usuelles cohérentes avec le style (marquées
// en commentaire "estimé"). Tout est éditable à la volée depuis l'app.
const BEERS_DB = [

  // ================= NORD / HAUTS-DE-FRANCE =================

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
      { label: "Saison", style: "Blonde", abv: 6.5 },
      { label: "Chapelle", style: "Blonde", abv: 6.5 },
    ],
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
    variants: [
      { label: "Blonde", style: "Blonde", abv: 8.0 },
      { label: "IPA", style: "IPA", abv: 6.0 },
      { label: "Extra Stout", style: "Brune", abv: 8.5 },
      { label: "NEIPA", style: "NEIPA", abv: 5.6 },
      { label: "Prestige", style: "Triple", abv: 8.0 },
    ],
  },
  {
    brand: "Choulette",
    variants: [
      { label: "Ambrée", style: "Ambrée", abv: 7.5 },
      { label: "Framboise", style: "Fruitée", abv: 4.5 },
    ],
  },
  {
    brand: "Thiriez",
    variants: [
      { label: "Blonde d'Esquelbecq", style: "Blonde", abv: 4.5 },
      { label: "Ambrée d'Esquelbecq", style: "Ambrée", abv: 5.5 },
      { label: "Triple", style: "Triple", abv: 8.5 },
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
    brand: "Motte-Cordonnier",
    variants: [
      { label: "René", style: "Blonde", abv: 6.0 },
      { label: "Camille", style: "Blanche", abv: 5.5 }, // estimé (Blanche IPA)
      { label: "Émile", style: "Triple", abv: 9.0 },
      { label: "Fernand", style: "Blonde", abv: 6.0 }, // estimé (Saison)
      { label: "Bière de Famille", style: "Ambrée", abv: 7.0 },
      { label: "100 ans du Beffroi", style: "Brune", abv: 6.5 }, // estimé
      { label: "Louis", style: "Sans Alcool", abv: 0.0 },
    ],
  },
  {
    brand: "Brasserie des 2 Caps",
    variants: [{ label: "Noire de Slack", style: "Brune", abv: 5.4 }],
  },
  {
    brand: "Goudale",
    variants: [
      { label: null, style: "Blonde", abv: 7.2 },
      { label: "Ambrée", style: "Ambrée", abv: 7.2 },
      { label: "IPA", style: "IPA", abv: 7.2 },
      { label: "Rubis", style: "Fruitée", abv: 5.0 },
      { label: "La Raoul", style: "Blonde", abv: 6.5 }, // estimé
      { label: "Belzebuth", style: "Blonde", abv: 13.0 },
      { label: "Belzebuth Rouge", style: "Fruitée", abv: 8.5 },
    ],
  },
  {
    brand: "Lepers",
    variants: [
      { label: "L'Angélus", style: "Blonde", abv: 7.0 },
      { label: "Bon Samaritain", style: "Ambrée", abv: 6.5 }, // estimé
    ],
  },
  {
    brand: "Mongy",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 5.5 }, // estimé
      { label: "Ambrée", style: "Ambrée", abv: 6.0 }, // estimé
      { label: "IPA", style: "IPA", abv: 6.0 }, // estimé
      { label: "Triple", style: "Triple", abv: 8.5 }, // estimé
    ],
  },
  {
    brand: "La Fière",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.5 }, // estimé
      { label: "Triple", style: "Triple", abv: 8.5 }, // estimé
    ],
  },
  { brand: "Cuvée des Jonquilles", variants: [{ label: null, style: "Blonde", abv: 6.5 }] }, // estimé
  { brand: "St Glinglin", variants: [{ label: null, style: "Blonde", abv: 5.5 }] }, // estimé
  { brand: "Reuze", variants: [{ label: "Triple", style: "Triple", abv: 8.5 }] },
  {
    brand: "Moulins d'Ascq",
    variants: [
      { label: "Amy Mill", style: "NEIPA", abv: 5.0 }, // estimé
      { label: "Ariane Mill", style: "NEIPA", abv: 6.5 }, // estimé
    ],
  },
  { brand: "La Divine", variants: [{ label: null, style: "Blonde", abv: 9.5 }] }, // estimé
  { brand: "Hellemus", variants: [{ label: null, style: "Blonde", abv: 6.0 }] }, // estimé

  // ================= BELGIQUE — TRAPPISTES =================

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
  { brand: "Orval", variants: [{ label: null, style: "Ambrée", abv: 6.2 }] },
  {
    brand: "Rochefort",
    variants: [
      { label: "6", style: "Brune", abv: 7.5 },
      { label: "8", style: "Brune", abv: 9.2 },
      { label: "10", style: "Brune", abv: 11.3 },
    ],
  },
  {
    brand: "Westmalle",
    variants: [
      { label: "Double", style: "Brune", abv: 7.0 },
      { label: "Triple", style: "Triple", abv: 9.5 },
    ],
  },
  {
    brand: "Westvleteren",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 5.8 },
      { label: "8", style: "Brune", abv: 8.0 },
      { label: "12", style: "Brune", abv: 10.2 },
    ],
  },
  {
    brand: "Achel",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 8.0 },
      { label: "Brune", style: "Brune", abv: 8.0 },
      { label: "Extra Blonde", style: "Blonde", abv: 9.5 },
      { label: "Extra Brune", style: "Brune", abv: 9.5 },
    ],
  },

  // ================= BELGIQUE — BIÈRES D'ABBAYE =================

  {
    brand: "Leffe",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.6 },
      { label: "Brune", style: "Brune", abv: 6.5 },
      { label: "Triple", style: "Triple", abv: 8.4 },
      { label: "Ruby", style: "Fruitée", abv: 5.0 },
      { label: "Radieuse", style: "Ambrée", abv: 8.2 },
      { label: "Royale", style: "Brune", abv: 7.0 },
      { label: "Rituel", style: "Triple", abv: 9.0 },
    ],
  },
  {
    brand: "Grimbergen",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.7 },
      { label: "Double", style: "Brune", abv: 6.5 },
      { label: "Triple", style: "Triple", abv: 9.0 },
      { label: "Blanche", style: "Blanche", abv: 5.0 },
    ],
  },
  {
    brand: "Affligem",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.8 },
      { label: "Double", style: "Brune", abv: 6.8 },
      { label: "Triple", style: "Triple", abv: 9.5 },
      { label: "Blanche", style: "Blanche", abv: 5.2 },
    ],
  },
  {
    brand: "Maredsous",
    variants: [
      { label: "6", style: "Blonde", abv: 6.3 },
      { label: "8", style: "Brune", abv: 8.0 },
      { label: "10", style: "Triple", abv: 10.0 },
    ],
  },
  {
    brand: "Val-Dieu",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.0 },
      { label: "Brune", style: "Brune", abv: 7.0 },
      { label: "Triple", style: "Triple", abv: 8.5 },
    ],
  },
  {
    brand: "Tongerlo",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.0 },
      { label: "Brune", style: "Brune", abv: 6.0 },
      { label: "Triple", style: "Triple", abv: 9.0 },
    ],
  },
  {
    brand: "Ename",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 7.0 },
      { label: "Brune", style: "Brune", abv: 7.0 },
      { label: "Triple", style: "Triple", abv: 9.0 },
    ],
  },
  {
    brand: "St. Feuillien",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 7.5 },
      { label: "Brune", style: "Brune", abv: 8.5 },
      { label: "Triple", style: "Triple", abv: 8.5 },
      { label: "Grand Cru", style: "Blonde", abv: 9.5 },
    ],
  },
  {
    brand: "Floreffe",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.3 },
      { label: "Double", style: "Brune", abv: 6.3 },
      { label: "Triple", style: "Triple", abv: 7.5 },
    ],
  },
  {
    brand: "Corsendonk",
    variants: [
      { label: "Agnus", style: "Blonde", abv: 7.5 },
      { label: "Pater", style: "Brune", abv: 7.5 },
    ],
  },
  { brand: "La Paix-Dieu", variants: [{ label: null, style: "Blonde", abv: 10.0 }] },
  {
    brand: "Postel",
    variants: [
      { label: "Blond", style: "Blonde", abv: 6.5 },
      { label: "Dubbel", style: "Brune", abv: 6.5 },
      { label: "Tripel", style: "Triple", abv: 8.8 },
    ],
  },
  {
    brand: "Bornem",
    variants: [
      { label: "Dubbel", style: "Brune", abv: 8.0 },
      { label: "Tripel", style: "Triple", abv: 9.0 },
    ],
  },

  // ================= BELGIQUE — FORTES / CLASSIQUES =================

  {
    brand: "Duvel",
    variants: [
      { label: null, style: "Blonde", abv: 8.5 },
      { label: "Tripel Hop", style: "Blonde", abv: 9.5 },
    ],
  },
  {
    brand: "Delirium",
    variants: [
      { label: "Tremens", style: "Blonde", abv: 8.5 },
      { label: "Nocturnum", style: "Brune", abv: 8.5 },
      { label: "Red", style: "Rouge", abv: 8.0 },
    ],
  },
  {
    brand: "La Chouffe",
    variants: [
      { label: null, style: "Blonde", abv: 8.0 },
      { label: "McChouffe", style: "Brune", abv: 8.5 },
      { label: "Houblon Chouffe", style: "IPA", abv: 9.0 },
    ],
  },
  {
    brand: "Bosteels",
    variants: [
      { label: "Tripel Karmeliet", style: "Triple", abv: 8.4 },
      { label: "Pauwel Kwak", style: "Ambrée", abv: 8.0 },
      { label: "DeuS", style: "Blonde", abv: 11.5 },
    ],
  },
  {
    brand: "Kasteel",
    variants: [
      { label: "Donker", style: "Brune", abv: 11.0 },
      { label: "Tripel", style: "Triple", abv: 11.0 },
      { label: "Rouge", style: "Fruitée", abv: 8.0 },
    ],
  },
  {
    brand: "Gouden Carolus",
    variants: [
      { label: "Classic", style: "Brune", abv: 8.5 },
      { label: "Tripel", style: "Triple", abv: 9.0 },
      { label: "Ambrio", style: "Ambrée", abv: 8.0 },
    ],
  },
  { brand: "Piraat", variants: [{ label: null, style: "Blonde", abv: 10.5 }] },
  { brand: "Judas", variants: [{ label: null, style: "Blonde", abv: 8.5 }] },
  {
    brand: "Bush",
    variants: [
      { label: "Ambrée", style: "Ambrée", abv: 12.0 },
      { label: "Blonde", style: "Blonde", abv: 12.5 },
    ],
  },
  {
    brand: "Ciney",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 7.0 },
      { label: "Brune", style: "Brune", abv: 7.0 },
    ],
  },
  { brand: "Poperings Hommelbier", variants: [{ label: null, style: "Blonde", abv: 7.5 }] },
  { brand: "Cuvée des Trolls", variants: [{ label: null, style: "Blonde", abv: 7.0 }] },
  { brand: "Barbar", variants: [{ label: null, style: "Blonde", abv: 8.0 }] },
  {
    brand: "Vedett",
    variants: [
      { label: "Blond", style: "Pils", abv: 5.2 },
      { label: "Extra White", style: "Blanche", abv: 4.7 },
    ],
  },
  {
    brand: "Hoegaarden",
    variants: [
      { label: "Blanche", style: "Blanche", abv: 4.9 },
      { label: "Rosée", style: "Fruitée", abv: 3.0 },
      { label: "Grand Cru", style: "Blonde", abv: 8.5 },
    ],
  },
  { brand: "Hapkin", variants: [{ label: null, style: "Blonde", abv: 8.5 }] },
  {
    brand: "Brugse Zot",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 6.0 },
      { label: "Double", style: "Brune", abv: 7.5 },
    ],
  },
  {
    brand: "Straffe Hendrik",
    variants: [
      { label: "Blond", style: "Blonde", abv: 6.5 },
      { label: "Tripel", style: "Triple", abv: 9.0 },
      { label: "Quadrupel", style: "Brune", abv: 11.0 },
    ],
  },
  {
    brand: "Rodenbach",
    variants: [
      { label: "Klassiek", style: "Rouge", abv: 5.2 },
      { label: "Grand Cru", style: "Rouge", abv: 6.0 },
    ],
  },
  { brand: "Duchesse de Bourgogne", variants: [{ label: null, style: "Rouge", abv: 6.2 }] },
  {
    brand: "Petrus",
    variants: [
      { label: "Oud Bruin", style: "Brune", abv: 5.5 },
      { label: "Aged Pale", style: "Rouge", abv: 7.3 },
    ],
  },
  { brand: "Bacchus", variants: [{ label: null, style: "Rouge", abv: 4.5 }] },
  { brand: "Gulden Draak", variants: [
      { label: "Classic", style: "Brune", abv: 10.5 },
      { label: "Blond", style: "Blonde", abv: 10.5 },
  ]},
  { brand: "Cornet", variants: [{ label: null, style: "Blonde", abv: 8.5 }] },
  { brand: "Brigand", variants: [{ label: null, style: "Blonde", abv: 9.0 }] },
  {
    brand: "Corne du Bois des Pendus",
    variants: [
      { label: "Blonde", style: "Blonde", abv: 8.5 },
      { label: "Triple", style: "Triple", abv: 9.0 },
    ],
  },
  { brand: "Palm", variants: [{ label: null, style: "Ambrée", abv: 5.2 }] },
  { brand: "Steendonk", variants: [{ label: null, style: "Blanche", abv: 4.5 }] },

  // ================= BELGIQUE — LAMBICS, FRUITÉES, SAISONS =================

  { brand: "Cantillon", variants: [{ label: "Gueuze", style: "Fruitée", abv: 5.0 }] },
  { brand: "Lindemans", variants: [{ label: "Kriek", style: "Fruitée", abv: 3.5 }] },
  { brand: "Belle-Vue", variants: [{ label: "Kriek", style: "Fruitée", abv: 5.2 }] },
  { brand: "Mort Subite", variants: [{ label: "Kriek", style: "Fruitée", abv: 4.3 }] },
  { brand: "Timmermans", variants: [{ label: "Kriek", style: "Fruitée", abv: 4.0 }] },
  { brand: "Boon", variants: [{ label: "Kriek", style: "Fruitée", abv: 4.0 }] },
  {
    brand: "Liefmans",
    variants: [
      { label: "Goudenband", style: "Rouge", abv: 8.0 },
      { label: "Fruitesse", style: "Fruitée", abv: 3.8 },
    ],
  },
  { brand: "Chapeau", variants: [{ label: null, style: "Fruitée", abv: 3.0 }] },
  { brand: "Saison Dupont", variants: [{ label: null, style: "Blonde", abv: 6.5 }] },
  { brand: "Saison Silly", variants: [{ label: null, style: "Blonde", abv: 5.0 }] },
  { brand: "Fantôme", variants: [{ label: null, style: "Blonde", abv: 8.0 }] },

  // ================= AUTRES BELGES DU QUOTIDIEN =================

  { brand: "Jupiler", variants: [{ label: null, style: "Pils", abv: 5.2 }] },
  { brand: "Stella Artois", variants: [{ label: null, style: "Pils", abv: 5.2 }] },
  { brand: "Maes", variants: [{ label: null, style: "Pils", abv: 5.2 }] },
  { brand: "Bavik", variants: [{ label: "Super Pils", style: "Pils", abv: 5.2 }] },
  { brand: "De Koninck", variants: [{ label: null, style: "Ambrée", abv: 5.2 }] },
  { brand: "Wittekerke", variants: [{ label: null, style: "Blanche", abv: 5.0 }] },
  { brand: "Blanche de Bruxelles", variants: [{ label: null, style: "Blanche", abv: 4.5 }] },
  { brand: "Grisette", variants: [{ label: null, style: "Blonde", abv: 4.1 }] },
  { brand: "3 Fonteinen", variants: [{ label: "Oude Geuze", style: "Fruitée", abv: 6.0 }] },
  { brand: "Girardin", variants: [{ label: "Gueuze", style: "Fruitée", abv: 5.0 }] },
  { brand: "Floris", variants: [{ label: null, style: "Fruitée", abv: 3.6 }] },


    // ================= BIERES EN CANETTES =================
  {
    brand: "8.6",
    variants: [
        { label: "Original", style: "Blonde", abv: 8.6 },
        { label: "Blond", style: "Pils", abv: 5.5 },
        { label: "IPA", style: "Blonde", abv: 7 },
        { label: "Gold", style: "Blonde", abv: 6.5 },
        { label: "Extreme", style: "Blonde", abv: 10.5 },
        { label: "Cherry", style: "Rouge", abv: 7.2 },
        { label: "Amber", style: "Ambrée", abv: 7.9 },
        { label: "Black", style: "Brune", abv: 7.9 },
    ],
  },

  {
    brand: "Amsterdam",
    variants: [
        { label: "Maximator", style: "Blonde", abv: 11.6 },
        { label: "Navigator", style: "Blonde", abv: 8.0 },
        { label: "Mariner", style: "Blonde", abv: 8.0 },
    ],
  },

  {
    brand: "Prestige",
    variants: [
        { label: "8", style: "Blonde", abv: 8.0 },
        { label: "12", style: "Blonde", abv: 12.0 },
    ],
  },

  {
    brand: "Démon",
    variants: [
        { label: "Mega Démon", style: "Blonde", abv: 16.0 },
        { label: "Bière du Démon", style: "Blonde", abv: 12.0 },
    ],
  },

  {
    brand: "Faxe",
    variants: [
        { label: "Premium", style: "Blonde", abv: 5.0 },
        { label: "10", style: "Blonde", abv: 10.0 },
    ],
  },




  // ================= AUTRES CLASSIQUES / INTERNATIONAUX =================

  {
    brand: "1664",
    variants: [
      { label: "Blonde", style: "Pils", abv: 5.5 },
      { label: "Blanc", style: "Blanche", abv: 5.0 },
      { label: "Rosé", style: "Fruitée", abv: 4.5 },
      { label: "0.0%", style: "Sans Alcool", abv: 0.0 },
    ],
  },
  { brand: "Heineken", variants: [{ label: null, style: "Pils", abv: 5.0 }] },
  { brand: "Kronenbourg", variants: [{ label: null, style: "Pils", abv: 4.2 }] },
  { brand: "Corona", variants: [{ label: null, style: "Aromatisée", abv: 4.5 }] },
  { brand: "Guinness", variants: [{ label: null, style: "Brune", abv: 4.2 }] },
  { brand: "Picon", variants: [{ label: null, style: "Aromatisée", abv: 7.0 }] },
  { brand: "Monaco", variants: [{ label: null, style: "Aromatisée", abv: 3.5 }] },
  { brand: "Pils random", variants: [{ label: null, style: "Pils", abv: 5.0 }] },
  { brand: "Corbeau", variants: [{ label: null, style: "Blonde", abv: 9.0 }] },
  { brand: "Rince Cochon", variants: [{ label: null, style: "Blonde", abv: 8.5 }] },

  {
    brand: "Desperados",
    variants: [
        { label: "Original", style: "Aromatisée", abv: 5.9 },
        { label: "Red", style: "Rouge", abv: 5.9 },
        { label: "Tropical", style: "Aromatisée", abv: 5.9 },
        { label: "Virgin", style: "Sans alcool", abv: 0.0 },
    ],
  },

];
