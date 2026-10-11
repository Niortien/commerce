#!/bin/sh
# Versions courtes tirées du master 60 s (mêmes images, mêmes voix) :
#   out/mon-djossi-30s.mp4 (Reels, TikTok) et out/mon-djossi-15s.mp4 (Stories, statut WhatsApp)
# Chaque plan est un passage [début, fin] du master ; le son est fondu sur 60 ms à chaque coupe.
set -e
cd "$(dirname "$0")/.."
SRC=out/mon-djossi-pub.mp4

cut() { # cut <sortie> <début fin> <début fin> ...
  out=$1; shift
  n=0; v=""; a=""
  while [ $# -gt 0 ]; do
    s=$1; e=$2; shift 2
    d=$(echo "$e - $s" | bc -l)
    f=$(echo "$d - 0.06" | bc -l)
    v="$v[0:v]trim=$s:$e,setpts=PTS-STARTPTS[v$n];"
    a="$a[0:a]atrim=$s:$e,asetpts=PTS-STARTPTS,afade=t=in:d=0.06,afade=t=out:st=$f:d=0.06[a$n];"
    n=$((n + 1))
  done
  i=0; c=""
  while [ $i -lt $n ]; do c="$c[v$i][a$i]"; i=$((i + 1)); done
  ffmpeg -v error -y -i "$SRC" -filter_complex "$v$a${c}concat=n=$n:v=1:a=1[v][a]" -map "[v]" -map "[a]" \
    -c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$out"
  echo "wrote $out ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")s)"
}

# 30 s : nuit · rupture · « avec Mon Djossi » + logo · caisse · hors ligne · Awa soulagée · écran de fin
cut out/mon-djossi-30s.mp4 0.4 3.6  7.0 9.6  13.0 18.3  25.0 31.0  31.6 34.2  48.6 50.6  51.6 60
# 15 s : nuit · logo · caisse · offre + slogan
cut out/mon-djossi-15s.mp4 0.4 3.6  15.6 18.6  25.0 28.4  54.8 60
