import { LookbookHero } from "./LookbookHero";
import { LookbookEditorial } from "./LookbookEditorial";
import { LookbookGrid } from "./LookbookGrid";
import { LookbookBehindScenes } from "./LookbookBehindScenes";
import { LookbookWhatsapp } from "./LookbookWhatsapp";
import { LookbookPhotoUpload } from "./LookbookPhotoUpload";

export function LookbookView() {
  return (
    <>
      <LookbookHero />
      <LookbookEditorial />
      <LookbookGrid />
      {/* <LookbookOutfit /> */}
      <LookbookBehindScenes />
      <LookbookWhatsapp />
      <LookbookPhotoUpload />
    </>
  );
}
