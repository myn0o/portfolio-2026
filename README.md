# Portfolio Emma Nguyen

Site statique en HTML, CSS et JavaScript, animé avec GSAP (ScrollTrigger + SplitText) et Lenis pour le scroll fluide.
Aucune installation n'est nécessaire : toutes les librairies et polices sont incluses dans le dossier `assets`.

## Lancer le site

Les pages projets lisent leur contenu dans `data/projects.json`. Les navigateurs bloquent cette lecture quand on ouvre
un fichier HTML en double-cliquant dessus, il faut donc passer par un petit serveur local :

- VS Code : extension **Live Server**, puis clic droit sur `index.html` > "Open with Live Server"
- ou en terminal, dans ce dossier : `python3 -m http.server 8000` puis ouvrir http://localhost:8000

Une fois mis en ligne (Netlify, GitHub Pages, o2switch, etc.), tout fonctionne directement.

## Structure

```
index.html               Accueil (hero, compétences, catégories de projets, contact)
montage-video.html       Reels + courts-métrages
photographie.html        Galerie photo
creation-digitale.html   Remplis ton feed, Brandbook, GAST, Arvie, Vibetune, Yummy Lips
site-web.html            Site touristique + Rata-Kata
a-propos.html            Vlogs + Edits
data/projects.json       Contenu de toutes les pages projets
assets/css/style.css     Styles + responsive
assets/js/main.js        Animations GSAP, rendu du JSON, visionneuse, transitions de page
assets/js/vendor/        GSAP 3.13, ScrollTrigger, SplitText, Lenis
assets/fonts/            League Spartan, Poppins, Shadows Into Light Two
assets/img/              Images optimisées en WebP
```

## Modifier le contenu (data/projects.json)

Chaque page projet a une liste de `sections`. Le champ `type` choisit la mise en page :

| type       | rendu                                                    |
|------------|----------------------------------------------------------|
| `reels`    | téléphones avec vidéo verticale                          |
| `films`    | courts-métrages (`layout: "frames"` ou `"player"`)       |
| `photos`   | grille photo (`span` = largeur sur 12 colonnes)          |
| `panels`   | panneaux vitrés avec des visuels (`cols`, `ratio`)       |
| `browsers` | captures dans des fenêtres de navigateur                 |
| `duo`      | deux visuels côte à côte (+ bouton vidéo)                |
| `site`     | grande maquette d'écran avec lien                        |
| `links`    | texte + bouton "Playlist"                                |

### Liens et vidéos à compléter

Ces champs sont vides pour l'instant. Tant qu'ils le sont, le site affiche "Vidéo bientôt disponible" ou un lien grisé.

- `video` (reels, Evolucion, Yummy Lips) : lien YouTube, Vimeo ou chemin vers un `.mp4` (ex. `assets/video/bakery.mp4`)
- `poster` d'Evolucion de la desigualdad : image d'aperçu
- `link` de Train de vie
- `url` des deux sites web (Kyoto et Rata-Kata)
- `button.url` des playlists Vlogs et Edits (page À propos)

Pour ajouter une photo : déposer le fichier dans `assets/img/photo/` puis ajouter une ligne dans la section `photos`.
Une rangée fait 12 colonnes sur ordinateur (ex. 6 + 3 + 3).

## Animations principales

- Préloader avec compteur (accueil, une fois par session) et rideau de transition entre les pages
- Fond lumineux animé qui suit le scroll et la souris, curseur personnalisé
- Titres découpés lettre par lettre (SplitText), titres manuscrits qui s'écrivent, arabesques qui se dessinent
- Hero en verre avec contour dessiné, inclinaison 3D à la souris, avatar flottant
- Dossiers de compétences qui s'ouvrent au survol (ou au toucher sur mobile) et laissent sortir les logos
- Cartes et visuels inclinables, boutons magnétiques, parallaxes au scroll
- Galerie photo révélée par rideaux, visionneuse plein écran (clavier, flèches, swipe)
- Écrans des sites web qui se redressent au scroll

Les animations sont réduites automatiquement si le système demande moins de mouvements (`prefers-reduced-motion`).
