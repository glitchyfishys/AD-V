<script>
import wordShift from "@/core/word-shift";

import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import EternityChallengeBox from "./EternityChallengeBox";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EternityChallengesTab",
  components: {
    ChallengeTabHeader,
    ChallengeGrid,
    EternityChallengeBox,
    PrimaryButton
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false,
      autoEC: false,
      isAutoECVisible: false,
      hasUpgradeLock: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      hasECR: false,
      allowECcomplete: false,
      ECreq: [],
      isEnslaved: false,
      isDoomed: false,
    };
  },
  computed: {
    challenges() {
      return EternityChallenges.all;
    },
    upgradeLockNameText() {
      return RealityUpgrade(12).isLockingMechanics
        ? RealityUpgrade(12).name
        : ImaginaryUpgrade(15).name;
    },
    nextECText() {
      return this.untilNextEC.totalMilliseconds === 0 && !this.autoEC
        ? "Immediately upon unpausing"
        : `${this.untilNextEC} (real time)`;
    },
    allECText() {
      return this.untilAllEC.totalMilliseconds === 0 && !this.autoEC
        ? "Immediately upon unpausing"
        : `After ${this.untilAllEC} (real time)`;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.unlockedCount = EternityChallenges.all
        .filter(this.isChallengeVisible)
        .length;
      this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
      this.autoEC = player.reality.autoEC;
      const shouldPreventEC7 = TimeDimension(1).amount.gt(0);
      this.hasUpgradeLock = RealityUpgrade(12).isLockingMechanics ||
        (ImaginaryUpgrade(15).isLockingMechanics && shouldPreventEC7 &&
          !Array.range(1, 6).some(ec => !EternityChallenge(ec).isFullyCompleted));
      const remainingCompletions = EternityChallenges.remainingCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Decimal.max(autoECInterval.sub(player.reality.lastAutoEC), 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC.add(autoECInterval.times(remainingCompletions - 1)));
      }
      this.hasECR = Perk.studyECRequirement.isBought;
      this.allowECcomplete = PlayerProgress.realityUnlocked();
      this.ECreq = [undefined,"1e30", "1e30", "1e30", "1e40", "1e50", "1e60", "1e70", "1e80", "1e100","1e150","1e1300","1e1400","1e1E300"];
      this.isEnslaved = Enslaved.isRunning;
      this.isDoomed = Pelle.isDoomed;
    },
    isChallengeVisible(challenge) {
      return challenge.completions > 0 || challenge.isUnlocked || challenge.hasUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    },
    ECc(){
      if(this.isDoomed) return GameUI.notify.error("You know why",3000);
      if(this.isEnslaved) return GameUI.notify.error("Can't be used in The Nameless Ones' reality",3000);
      if(Effarig.isRunning && Effarig.currentStage < 4) return GameUI.notify.error("Can't be used in the Effarig's Reality, until the Reality layer is complete",3000)
      let h=0;
      for(let i=1; i <= 12; i++){
        if(!Currency.eternityPoints.gte(this.ECreq[i])) break;
        if(player.eternityChalls["eterc" + i] < 5 || player.eternityChalls["eterc" + i] == undefined) {
          player.eternityChalls["eterc" + i] = 5;
        }
          h = i;
      }
       if(!Currency.eternityPoints.gte("1e4000")) h == 12 ?  GameUI.notify.eternity("All EC's are completed",3000) : GameUI.notify.eternity("Fully completed EC's up to " + (h) + ", next ec" + (h+1) + " at " + format( new Decimal(this.ECreq[h+1])) + " EP",3000);
    },
    pelleText() {
      return wordShift.wordCycle(['Destoryed','Annihilated','Obliterated']);
    },
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />

    <span v-if="allowECcomplete">
      <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="ECc"
        >
        <span v-if="isEnslaved">
        broken by compaction of this reality
        </span>
        <span v-else-if="isDoomed">
          {{pelleText()}} by Pelle
        </span>
        <span v-else>
        complete EC's
        </span>
        
      </PrimaryButton>
    </span>

    <div v-if="isAutoECVisible">
      Eternity Challenges are automatically completed sequentially, requiring all previous
      Eternity Challenges to be fully completed before any progress is made.
    </div>
    <div
      v-if="isAutoECVisible && remainingECTiers > 0"
      class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
    >
      <div class="l-challenges-tab__auto-ec-timers">
        <span
          v-if="hasUpgradeLock"
          class="l-emphasis"
        >
          Auto EC is currently disabled because of the "{{ upgradeLockNameText }}" upgrade requirement lock.
        </span>
        <span v-if="remainingECTiers > 0">
          Next Auto Eternity Challenge completion: {{ nextECText }}
        </span>
        <span>
          All Auto Eternity Challenge completions: {{ allECText }}
        </span>
        <br>
      </div>
    </div>
    <div>
      Complete Eternity Challenges again for a bigger reward, maximum of {{ formatInt(5) }} times.<br>
      The rewards are applied permanently with no need to have the respective Eternity Challenge Time Study purchased.
    </div>
    <div v-if="!hasECR">
      When you respec out of an unlocked Eternity Challenge, you don't need to redo the secondary requirement<br>
      in order to unlock it again until you complete it; only the Time Theorems are required.
    </div>
    <div v-if="unlockedCount !== 12">
      You have seen {{ formatInt(unlockedCount) }} out of {{ formatInt(12) }} Eternity Challenges.
    </div>
    <div v-else>
      You have seen all {{ formatInt(12) }} Eternity Challenges.
    </div>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
  </div>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
