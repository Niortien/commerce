"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { EPISODES_VIDEO, VIDEO_COMPLETE, type VideoGuide } from "@/lib/guideVideos";

interface GuideVideosProps {
  /** Le guide affiché n'est pas celui des vêtements : on précise que la vidéo prend cet exemple. */
  autreCommerce: boolean;
}

/**
 * Le tutoriel en vidéo : un lecteur vertical (format téléphone) et la liste des épisodes à côté.
 * Choisir un épisode le lance aussitôt ; la vidéo ne se charge qu'au premier clic (preload="none").
 */
export function GuideVideos({ autreCommerce }: GuideVideosProps) {
  const [actuelle, setActuelle] = useState<VideoGuide>(VIDEO_COMPLETE);
  const [choisie, setChoisie] = useState(false);
  const lecteur = useRef<HTMLVideoElement>(null);

  // Après un choix dans la liste, la nouvelle vidéo (remontée via `key`) démarre seule.
  useEffect(() => {
    if (choisie) void lecteur.current?.play().catch(() => undefined);
  }, [actuelle, choisie]);

  const choisir = (v: VideoGuide) => {
    setActuelle(v);
    setChoisie(true);
  };

  const liste = [VIDEO_COMPLETE, ...EPISODES_VIDEO];

  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10">
      <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px] bg-[#0F172A] p-1.5 shadow-[0_24px_48px_-30px_rgb(8_15_35/0.8)]">
        <video
          ref={lecteur}
          key={actuelle.id}
          src={actuelle.src}
          poster={actuelle.poster}
          controls
          playsInline
          preload="none"
          aria-label={`Vidéo : ${actuelle.titre}`}
          className="aspect-[9/16] w-full rounded-[22px] bg-[#0F172A] object-cover"
        />
      </div>

      <div>
        {autreCommerce && (
          <p className="mb-4 max-w-prose rounded-xl bg-surface-high px-4 py-3 text-sm leading-relaxed text-text-muted">
            La vidéo prend l&apos;exemple d&apos;une boutique de vêtements. Les étapes sont les mêmes pour ton commerce ; seuls quelques noms de
            pages changent.
          </p>
        )}
        <ol className="space-y-2" aria-label="Épisodes du tutoriel">
          {liste.map((v, i) => {
            const active = v.id === actuelle.id;
            return (
              <li key={v.id}>
                <Button
                  variant="light"
                  onPress={() => choisir(v)}
                  aria-current={active ? "true" : undefined}
                  className={[
                    "h-auto w-full justify-start gap-3 rounded-xl px-3.5 py-3 text-left",
                    active ? "bg-surface ring-2 ring-[color:var(--sector)]" : "bg-surface data-[hover=true]:bg-surface-high",
                  ].join(" ")}
                >
                  <span
                    aria-hidden
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      active ? "bg-[color:var(--sector)] text-white" : "bg-surface-high text-text",
                    ].join(" ")}
                  >
                    {active ? <IconPlayerPlayFilled size={15} /> : i === 0 ? "▶" : i}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-semibold text-text">{v.titre}</span>
                      <span className="shrink-0 text-xs font-medium tabular-nums text-text-muted">{v.duree}</span>
                    </span>
                    <span className="mt-0.5 block whitespace-normal text-sm leading-snug text-text-muted">{v.resume}</span>
                  </span>
                </Button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
