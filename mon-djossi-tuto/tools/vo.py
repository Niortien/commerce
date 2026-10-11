# Voix off du tutoriel (Kokoro, voix française ff_siwis), « humanisées » : EQ, compression, petite pièce.
# Usage : KOKORO_DIR=/chemin/modele python tools/vo.py
# Écrit assets/vo/<id>.wav, assets/vo/vo.json (enveloppes pour la synchro des lèvres) et vo-data.js (durées + textes).
import json, os, subprocess
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

MODEL = os.environ.get("KOKORO_DIR", ".")
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "assets", "vo")
k = Kokoro(os.path.join(MODEL, "kokoro.onnx"), os.path.join(MODEL, "voices.bin"))

# (id, chapitre, texte affiché ; le texte lu est le même sans guillemets)
LINES = [
    ("i1", "intro", "Awa a une boutique de vêtements à Abidjan."),
    ("i2", "intro", "Suis-la : en trois minutes, tu vas installer ta boutique, et faire ta première vente."),
    ("c1a", "c1", "Étape un. Sur le site, touche « Essai gratuit »."),
    ("c1b", "c1", "Choisis ton type de commerce : ici, Vêtements. Il décide des pages que tu verras."),
    ("c1c", "c1", "Puis écris le nom de ta boutique, ta ville, ton WhatsApp, ton email, et un mot de passe."),
    ("c1d", "c1", "C'est gratuit pendant quatorze jours."),
    ("c2", "c2", "Étape deux. Ouvre « Ma boutique ». Ajoute ton adresse, ton WhatsApp et ton logo : ils s'imprimeront sur chaque reçu."),
    ("c3", "c3", "Étape trois. Les catégories, ce sont les tiroirs de ta boutique. Quelques-unes existent déjà ; ajoute celles qui manquent."),
    ("c4a", "c4", "Étape quatre. Ouvre « Produits », et touche le bouton bleu."),
    ("c4b", "c4", "Écris le nom, la catégorie, le prix de vente, et le prix d'achat : c'est lui qui calcule ton bénéfice."),
    ("c4c", "c4", "Ajoute une variante par taille et par couleur, avec sa quantité."),
    ("c4d", "c4", "Le seuil d'alerte, c'est le nombre en dessous duquel l'application te prévient."),
    ("c5a", "c5", "Étape cinq. Dis à l'application ce que tu as déjà en rayon : c'est une entrée."),
    ("c5b", "c5", "Tu as beaucoup d'articles ? Remplis le modèle Excel, et importe-le : tout est créé d'un coup."),
    ("c6", "c6", "Étape six. Ajoute tes caissiers, avec un email et un mot de passe. Chacun a son accès : tu sais qui a vendu quoi, et ils ne touchent pas aux réglages."),
    ("d1", "d1", "Et maintenant, la journée commence. Chaque matin, ouvre la caisse : c'est comme lever le rideau."),
    ("d2a", "d2", "Pour vendre, ouvre « Sorties », puis « Nouvelle sortie », et « Vente »."),
    ("d2b", "d2", "Ajoute l'article, ou scanne son code-barres. Choisis la taille et la couleur."),
    ("d2c", "d2", "Passe au paiement : espèces, Wave, Orange Money ou MTN. En espèces, l'application calcule la monnaie."),
    ("d2d", "d2", "Enregistre, imprime le reçu : le stock baisse tout seul."),
    ("d3", "d3", "Internet coupe ? Continue à vendre. Tout part dès que le réseau revient, sans doublon."),
    ("d4", "d4", "Le soir, regarde ton total, puis termine la journée."),
    ("d5", "d5", "Et sur le Dashboard, tu sais enfin combien ta journée a rapporté. Le guide complet t'attend dans le menu « Guide »."),
]
SPEED = 0.9
AF = ("highpass=f=80,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3500:t=q:w=1.2:g=2,"
      "acompressor=threshold=-20dB:ratio=3:attack=5:release=80,aecho=0.8:0.6:18|31:0.07|0.05,"
      "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
      "silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-18:TP=-2:LRA=7,aresample=48000")

meta, data = {}, {}
for id_, chap, text in LINES:
    spoken = text.replace("« ", "").replace(" »", "")
    s, sr = k.create(spoken, voice="ff_siwis", speed=SPEED, lang="fr-fr")
    raw = os.path.join(OUT, id_ + "_raw.wav")
    sf.write(raw, s, sr)
    out = os.path.join(OUT, id_ + ".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", AF, "-ac", "1", out], check=True)
    os.remove(raw)
    d, r2 = sf.read(out)
    hop = r2 // 30
    env = [float(np.sqrt(np.mean(d[i:i + hop] ** 2))) for i in range(0, len(d), hop)]
    mx = max(env) or 1
    dur = round(len(d) / r2, 3)
    meta[id_] = {"mouth": [round(min(1, e / mx * 1.3), 3) for e in env]}
    data[id_] = {"chap": chap, "text": text, "dur": dur}
    print(id_, dur, text)

json.dump(meta, open(os.path.join(OUT, "vo.json"), "w"))
with open(os.path.join(ROOT, "vo-data.js"), "w") as f:
    f.write("// généré par tools/vo.py : textes et durées mesurées des voix off\n")
    f.write("(function () { const VO_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n")
    f.write("if (typeof module !== 'undefined') module.exports = VO_DATA; else globalThis.VO_DATA = VO_DATA; })();\n")
