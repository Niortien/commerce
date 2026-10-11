# Tutoriel Mon Djossi (2 min 31, 9:16)

Awa installe sa boutique de vêtements sur Mon Djossi (6 étapes), puis vit sa première journée : ouvrir la caisse, vendre, vendre sans internet, fermer la caisse, lire le Dashboard. Les noms des pages et des boutons sont ceux de l'app (`lib/navigation.ts`, `lib/guides.ts`, `components/`).

| Fichier | Rôle |
| --- | --- |
| `tools/vo.py` | Génère les 23 voix off (Kokoro `ff_siwis`) → `assets/vo/`, `vo-data.js` (durées) |
| `score.js` | Ligne de temps : la voix pose le temps ; chaque tap, saisie et écran est calé sur un mot |
| `song.js` | Groove afrobeats doux, un son par geste, musique baissée sous la voix → `out/music.wav` |
| `film.js` | Les 24 écrans de l'app, le doigt, les libellés jaunes, les illustrations, l'intro et la fin |
| `tools/episodes.js` | Découpe 6 épisodes (14 à 39 s) pour les réseaux |

## Construire

```bash
KOKORO_DIR=/chemin/modele python tools/vo.py   # seulement si le texte change
node song.js
CHROME_PATH=/chemin/chrome node engine/render.js video
node engine/render.js mux                      # -> out/mon-djossi-tuto.mp4
node tools/episodes.js                         # -> out/episode-*.mp4
```

Les montants (185 000 F CFA, etc.) sont des données d'exemple, signalées à l'écran.
