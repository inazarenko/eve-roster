<template>
  <div class="root">
    <div
      v-if="position == 0"
      class="progress-bar"
      :style="{ width: entry.progress * 100 + '%' }"
    ></div>
    <div class="main-line">
      <skill-pips
        class="pips"
        :trainedLevel="entry.skill.level"
        :queuedLevel="entry.targetLevel"
      />
      <div class="name">
        {{ entry.skill.name }}
        <span class="numeral-level">{{ entry.targetLevel | numeralize }}</span>
      </div>
      <div class="duration" :title="entry.eta">
        {{ entry.durationLabel || "Paused" }}
      </div>
    </div>
    <div
      class="queue-bar"
      :style="{
        left: entry.proportionalStart * 100 + '%',
        width: (entry.proportionalEnd - entry.proportionalStart) * 100 + '%',
      }"
    ></div>
  </div>
</template>

<script>
import SkillPips from "./SkillPips.vue";

const SKILL_LEVEL_LABELS = ["0", "I", "II", "III", "IV", "V"];

export default {
  components: {
    SkillPips,
  },

  props: {
    entry: { type: Object, required: true },
    position: { type: Number, required: true },
  },

  filters: {
    numeralize: function (value) {
      return SKILL_LEVEL_LABELS[value];
    },
  },
};
</script>

<style scoped>
.root {
  display: flex;
  position: relative;
  height: 35px;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #323232;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background: #252a2c;
}

.main-line {
  display: flex;
  flex: 1;
  position: relative;
  align-items: baseline;
}

.pips {
  margin-left: 13px;
  margin-right: 13px;
}

.name {
  flex: 1;
  color: #cdcdcd;
}

.numeral-level {
  color: #0083ad;
  margin-left: 2px;
}

.duration {
  color: #8a8a8a;
  margin-right: 13px;
}

.queue-bar {
  position: absolute;
  height: 1px;
  background: #0083ad;
  top: 100%;
}
</style>
