import { AutobuyerState } from "./autobuyer";

export class TesseractAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.tess;
  }

  get name() {
    return `Tesseract`;
  }

  get isUnlocked() {
    return MetaFabricatorUpgrade(11).isBought;
  }

  get bulk() {
    return 0;
  }

  tick() {
    Tesseracts.buyTesseract();
  }
}