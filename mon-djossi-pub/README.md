# Publicité Mon Djossi (60 s, 9:16)

Vidéo de 60 secondes tirée du script « Le cahier ou le téléphone ». Chaque image est dessinée par code, la musique est synthétisée, et les voix off sont générées en local par Kokoro (voix française `ff_siwis`).

| Fichier | Rôle |
| --- | --- |
| `score.js` | Ligne de temps unique : tempo (108 BPM), accords, moments clés, voix off, sous-titres |
| `song.js` | Bande-son (afrobeats + bruitages + voix, musique baissée sous la voix) → `out/music.wav` |
| `film.js` | Les scènes : nuit, matin, réseau, rembobinage, logo, app, métiers, soir, écran de fin |
| `assets/vo/*.wav`, `vo.json` | Voix off et enveloppes pour la synchronisation des lèvres |
| `tools/vo.py` | Regénère les voix (`pip install kokoro-onnx soundfile`, modèle dans `KOKORO_DIR`) |

## Construire

```bash
node song.js                            # musique + voix -> out/music.wav
CHROME_PATH=/chemin/chrome node engine/render.js video   # images -> out/video.mp4
node engine/render.js mux               # -> out/mon-djossi-pub.mp4
node engine/render.js verify            # synchro son/image aux moments clés
```

Les montants à l'écran sont des données d'exemple. Le slogan « Mon Djossi, ça compte pour toi » est une proposition à valider.
