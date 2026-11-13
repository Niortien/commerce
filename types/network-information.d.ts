/** Qualité de connexion annoncée par le navigateur (Chrome Android, Edge…), absente des types DOM standard. */
interface InformationReseau {
  /** « 4g », « 3g », « 2g » ou « slow-2g ». */
  effectiveType?: string;
}

interface Navigator {
  connection?: InformationReseau;
}
