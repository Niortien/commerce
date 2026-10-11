import json, subprocess, soundfile as sf, numpy as np
from kokoro_onnx import Kokoro
import os, sys
MODEL = os.environ.get("KOKORO_DIR", ".")
k = Kokoro(os.path.join(MODEL, "kokoro.onnx"), os.path.join(MODEL, "voices.bin"))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "vo") + "/"
# (id, who, text, speed)  — Awa = gérante ; N = narratrice
LINES = [
 ("awa1","awa","Mais… l'argent est parti où, même ?",0.92),
 ("n1","n","Rupture découverte trop tard…",0.95),
 ("n2","n","Le réseau qui coupe… et des comptes qui ne tombent jamais juste.",1.0),
 ("n3","n","Et si on reprenait la journée ? Avec Mon Djossi.",1.0),
 ("n4","n","Une alerte vous prévient, avant la rupture.",1.0),
 ("n5","n","Produit, taille, encaisser.",1.0),
 ("n6","n","Le reçu sort, et le stock se met à jour tout seul.",1.02),
 ("n7","n","Internet coupe ? La caisse continue.",1.0),
 ("n8","n","Tout s'envoie dès que le réseau revient.",1.02),
 ("n9","n","Boutique, restaurant, quincaillerie, friperie…",1.0),
 ("n10","n","Mon Djossi parle votre métier.",0.98),
 ("awa2","awa","Là… je sais combien j'ai gagné !",0.95),
 ("n11","n","Sachez chaque soir combien votre commerce a gagné.",0.98),
 ("n12","n","Quatorze jours d'essai gratuit.",0.98),
 ("n13","n","Mon Djossi… ça compte pour toi !",0.95),
]
meta = {}
for id_, who, text, sp in LINES:
    s, sr = k.create(text, voice="ff_siwis", speed=sp*0.9, lang="fr-fr")
    raw = OUT + id_ + "_raw.wav"; sf.write(raw, s, sr)
    # humanize: Awa a touch higher/younger; both get gentle EQ, compression, tiny room
    pitch = "asetrate=24000*1.045,aresample=24000,atempo=0.957," if who=="awa" else ""
    af = (pitch + "highpass=f=80,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3500:t=q:w=1.2:g=2,"
          "acompressor=threshold=-20dB:ratio=3:attack=5:release=80,"
          "aecho=0.8:0.6:18|31:0.07|0.05,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
          "silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-18:TP=-2:LRA=7,aresample=48000")
    out = OUT + id_ + ".wav"
    subprocess.run(["ffmpeg","-v","error","-y","-i",raw,"-af",af,"-ac","1",out],check=True); os.remove(raw)
    d, r2 = sf.read(out)
    # mouth envelope at 30 fps for lip-sync
    hop = r2//30; env = [float(np.sqrt(np.mean(d[i:i+hop]**2))) for i in range(0,len(d),hop)]
    mx = max(env) or 1
    meta[id_] = {"who":who,"text":text,"dur":round(len(d)/r2,3),"mouth":[round(min(1,e/mx*1.3),3) for e in env]}
    print(id_, who, meta[id_]["dur"], text)
json.dump(meta, open(OUT+"vo.json","w"))
