/** API de lecture de codes-barres du navigateur (Chrome Android, Edge…), absente des types DOM standard. */
interface DetecteurCodeResultat {
  rawValue: string;
  format: string;
}

interface DetecteurCode {
  detect(source: HTMLVideoElement): Promise<DetecteurCodeResultat[]>;
}

interface DetecteurCodeConstructeur {
  new (options?: { formats?: string[] }): DetecteurCode;
  getSupportedFormats(): Promise<string[]>;
}

interface Window {
  BarcodeDetector?: DetecteurCodeConstructeur;
}
