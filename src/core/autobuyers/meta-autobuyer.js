import { AutobuyerState } from "./autobuyer";

export class MetaAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.meta;
  }

  get name() {
    return `Meta`;
  }

  get isUnlocked() {
    return Achievement(204).isUnlocked;
  }

  get canTick() {
    return super.canTick && !GlyphSelection.active;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get mr() {
    return this.data.mr;
  }

  set mr(value) {
    this.data.mr = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xHighest() {
    return this.data.xHighest;
  }

  set xHighest(value) {
    this.data.xHighest = value;
  }

  toggleMode() {
    this.mode = [
      AUTO_META_MODE.AMOUNT,
      AUTO_META_MODE.TIME,
      AUTO_META_MODE.X_HIGHEST,
    ]
      .nextSibling(this.mode);
  }

  bumpAmount(mult) {
    if (this.isUnlocked) {
      this.mr = this.mr.times(mult);
    }
  }

  tick() {
    let proc = false;

    const mrProc = gainedMetaRelays();
    switch (this.mode) {
      case AUTO_META_MODE.AMOUNT:
        proc = mrProc.gte(this.mr);
        break;
      case AUTO_META_MODE.X_HIGHEST:
        proc = mrProc.gte(Currency.metaRelays.value.mul(this.xHighest));
        break;
      case AUTO_META_MODE.TIME:
        proc = (player.records.thisMeta.realTime / 1000) > this.time;
        break;
    }
    if (proc) processManualMeta();
  }
}
