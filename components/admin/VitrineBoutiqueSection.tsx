"use client";

import Link from "next/link";
import { Button, Snippet, Switch } from "@heroui/react";
import { IconBrandWhatsapp, IconExternalLink } from "@tabler/icons-react";
import { useUpdateMyBoutique } from "@/features/boutiques/mutation/boutiques-mutations";
import { vitrineUrl } from "@/lib/vitrine";
import type { Boutique } from "@/types";

/** Publier la vitrine en ligne et en partager le lien (bio Instagram, statut WhatsApp, comptoir). */
export function VitrineBoutiqueSection({ boutique }: { boutique: Boutique }) {
  const mutation = useUpdateMyBoutique();
  const active = boutique.vitrineActive ?? false;
  const url = vitrineUrl(boutique.slug);
  const partage = `https://wa.me/?text=${encodeURIComponent(`Découvrez nos articles disponibles et commandez sur WhatsApp : ${url}`)}`;

  return (
    <section aria-labelledby="vitrine-titre" className="mb-6 flex max-w-xl flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="vitrine-titre" className="text-sm font-medium text-text">
            Vitrine en ligne
          </h2>
          <p className="text-xs text-text-muted">
            Une page publique avec vos articles en stock. Vos clients commandent sur votre WhatsApp. Le prix d&apos;achat et
            les quantités n&apos;y apparaissent jamais.
          </p>
        </div>
        <Switch
          isSelected={active}
          isDisabled={mutation.isPending}
          onValueChange={(v) => mutation.mutate({ vitrineActive: v })}
          aria-label="Publier ma vitrine en ligne"
        />
      </div>

      {active ? (
        <>
          <Snippet symbol="" variant="bordered" size="sm" className="max-w-full" classNames={{ pre: "truncate" }}>
            {url}
          </Snippet>
          <div className="flex flex-wrap gap-2">
            <Button
              as="a"
              href={partage}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className="bg-[#1a8f4c] text-white"
              startContent={<IconBrandWhatsapp size={16} aria-hidden />}
            >
              Partager sur WhatsApp
            </Button>
            <Button
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="bordered"
              startContent={<IconExternalLink size={16} aria-hidden />}
            >
              Voir ma vitrine
            </Button>
          </div>
          {!boutique.whatsapp ? (
            <p className="text-xs text-warning">
              Ajoutez votre numéro WhatsApp dans{" "}
              <Link href="/admin/boutiques" className="underline">
                Ma boutique
              </Link>{" "}
              : c&apos;est là que vos clients vous enverront leurs commandes.
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
