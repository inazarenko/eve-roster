<!--
  Generic container for pages in the app. Displays the root nav bar at the top
  and main content in a horizontally-centered container.
-->

<template>
  <div class="_app-page">
    <app-header :identity="identity" />
    <div
      class="centering-container"
      :style="{ width: contentWidth ? contentWidth + 'px' : '1000px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AppHeader from "./AppHeader.vue";

export default Vue.extend({
  components: {
    AppHeader,
  },

  props: {
    identity: { type: Object, required: true },
    contentWidth: { type: Number, required: false },
  },
});
</script>

<style scoped>
.centering-container {
  margin: 0 auto;
}
</style>
