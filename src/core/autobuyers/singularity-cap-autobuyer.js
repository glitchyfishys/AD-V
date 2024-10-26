import { Singularity } from "../globals";
import { AutobuyerState } from "./autobuyer";

export class SingularityCapAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singCap;
  }

  get name() {
    return `Singularity Cap`;
  }

  get isUnlocked() {
    return MetaFabricatorUpgrade(24).isBought;
  }

  get bulk() {
    return 0;
  }

  tick() {
    Singularity.increaseCap(true);
  }
}