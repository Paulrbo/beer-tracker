# Le Compteur 🍺

App perso de suivi de consommation de bière — PWA installable sur iPhone, sans Mac ni App Store.

## Fonctionnalités

- **Accueil** : bouton "Ajouter une bière" (recherche de marque + quantité 25/33/50cl ou perso), bouton "La p'tite sœur" qui rajoute instantanément la dernière bière bue.
- **Historique** : liste par jour, modification de la quantité, suppression.
- **Stats** : compteurs semaine / mois / année, graphique en bâtonnets style "pointage de bar" sur 12 semaines, top des marques.
- Fonctionne **hors-ligne** une fois installée (service worker).
- Toutes les données restent **en local sur ton téléphone** (localStorage) — rien n'est envoyé nulle part.
- Liste de marques 100% éditable à la main : `beers.js` contient une petite liste de départ, et tu peux ajouter n'importe quelle nouvelle marque directement depuis l'app (bouton "+ Ajouter une nouvelle marque").

## Déploiement (obligatoire pour installer sur iPhone)

Safari exige du HTTPS pour installer une PWA sur l'écran d'accueil. Le plus simple et gratuit : **GitHub Pages**.

1. Crée un nouveau repo GitHub (public ou privé), ex. `biere-tracker`.
2. Pousse tous les fichiers de ce dossier à la racine du repo :
   ```bash
   git init
   git add .
   git commit -m "Le Compteur - v1"
   git branch -M main
   git remote add origin https://github.com/<ton-user>/biere-tracker.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : branche `main`, dossier `/ (root)`**. Sauvegarde.
4. Après ~1 minute, ton app est en ligne sur `https://<ton-user>.github.io/biere-tracker/`.

## Installer sur ton iPhone

1. Ouvre l'URL ci-dessus dans **Safari** (pas Chrome — l'installation PWA via Chrome iOS ne fonctionne pas).
2. Appuie sur l'icône de partage (le carré avec la flèche vers le haut).
3. **Ajouter à l'écran d'accueil**.
4. L'icône "Le Compteur" apparaît sur ton écran d'accueil, elle s'ouvre en plein écran comme une vraie app.

## Tester en local avant de déployer

```bash
python3 -m http.server 8000
```
Puis ouvre `http://localhost:8000` dans un navigateur.

## Étendre la liste de bières

`beers.js` est un simple tableau JS :
```js
{ name: "Nom de la bière", style: "Style", abv: 6.5 }
```
Quand tu veux la liste détaillée complète, demande-la moi et je te la génère — il suffira de remplacer le contenu de ce fichier.

## Prochaines idées (pas encore implémentées)

- Export CSV des données
- Calcul en unités d'alcool (basé sur le degré renseigné)
- Filtre par style de bière dans les stats
