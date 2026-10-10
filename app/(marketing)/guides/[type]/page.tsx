import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "@/components/guide/GuideView";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { TYPES_COMMERCE } from "@/lib/commerce";
import { getGuide, slugGuide, typeDepuisSlug } from "@/lib/guides";

interface GuideTypePageProps {
  params: { type: string };
}

export function generateStaticParams() {
  return TYPES_COMMERCE.map((t) => ({ type: slugGuide(t) }));
}

export function generateMetadata({ params }: GuideTypePageProps): Metadata {
  const type = typeDepuisSlug(params.type);
  if (!type) return {};
  const guide = getGuide(type);
  return { title: guide.titre, description: guide.accroche, alternates: { canonical: `/guides/${guide.slug}` } };
}

export default function GuideTypePage({ params }: GuideTypePageProps) {
  const type = typeDepuisSlug(params.type);
  if (!type) notFound();

  return (
    <>
      <MarketingNav />
      <main id="contenu" className="bg-base px-4 py-10 md:px-6 md:py-14">
        <GuideView guide={getGuide(type)} dansApp={false} />
      </main>
      <MarketingFooter />
    </>
  );
}
