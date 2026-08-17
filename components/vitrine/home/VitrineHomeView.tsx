"use client";

import { HomeHero } from "./HomeHero";
import { HomeTicker } from "./HomeTicker";
import { HomeFeaturedDrops } from "./HomeFeaturedDrops";
import { HomePromoSection } from "./HomePromoSection";
import { HomeCategorySections } from "./HomeCategorySections";
import { HomeBrandStatement } from "./HomeBrandStatement";
import { HomeWhatsappCta } from "./HomeWhatsappCta";

export function VitrineHomeView() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <HomeFeaturedDrops />
      <HomePromoSection />
      <HomeCategorySections />
      <HomeBrandStatement />
      <HomeWhatsappCta />
    </>
  );
}
