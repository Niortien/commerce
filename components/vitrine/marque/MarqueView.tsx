import { MarqueHero } from "./MarqueHero";
import { MarqueManifesto } from "./MarqueManifesto";
import { MarqueStory } from "./MarqueStory";
import { MarqueValues } from "./MarqueValues";
import { MarqueContact } from "./MarqueContact";
import { MarqueSocial } from "./MarqueSocial";

export function MarqueView() {
  return (
    <>
      <MarqueHero />
      <MarqueManifesto />
      <MarqueStory />
      <MarqueValues />
      <MarqueContact />
      <MarqueSocial />
    </>
  );
}
