import { IntervaledAutobuyerState } from "./autobuyer";

export class NullCycleAutobuyerState extends IntervaledAutobuyerState {
  get realTime(){
    return true;
  }

  get tier() {
    return this.id;
  }

  get name() {
    return NullCycle(this.tier).shortDisplayName;
  }

  get fullName() {
    return `${this.name} Null Cycle`;
  }

  get data() {
    return player.auto.nullCyc.all[this.tier - 1];
  }

  get interval() {
    return 0;
  }

  get hasUnlimitedBulk() {
    return true;
  }
  
  get isUnlocked() {
    return NullUpgrades.all[15].canBeApplied;
  }

  // We don't want to directly call super.canTick here because the game logic works really weirdly in terms of
  // interactions between individual and group AD autobuyers. The UI can change and certain settings can become
  // unmodifiable in some conditions. This is basically the lowest-effort solution to support legacy behavior
  // because the proper alternative of an AD autobuyer refactor to untangle this mess is likely not worth the effort
  get canTick() {
    // AD autobuyer-specific logic; if the UI is collapsed then we are unable to toggle groupSetting.
    // In terms of UX for this case it makes the most sense to ignore it and pretend it's true
    const settingConfig = player.auto.nullCyc;
    const individualSetting = settingConfig.all[this.tier - 1];
    const groupSetting = settingConfig.isActive;
    const thisSetting = individualSetting && groupSetting;

    // From IntervaledAutobuyerState.canTick
    const intervalTick = this.timeSinceLastTick >= this.interval;

    // From AutobuyerState.canTick (ignores this.constructor.isActive because that's accounted for in thisSetting)
    const autoTick = player.auto.autobuyersOn && this.isActive && (this.isUnlocked || this.isBought);
    return thisSetting && intervalTick && autoTick;
  }

  tick() {
    super.tick();
    NullCycle(this.tier).buy(true);
  }

  reset() {
    super.reset();
  }

  static get entryCount() { return 16; }
  static get autobuyerGroupName() { return "Null Cycle"; }

  // These are toggled on and off from the group autobuyer checkbox
  static get isActive() { return player.auto.nullCyc.isActive; }
  static set isActive(value) { player.auto.nullCyc.isActive = value; }

}
