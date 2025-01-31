<!--

A component that either looks like a "load more" button or a loading spinner.

-->

<template>
  <div class="_more-button">
    <loading-spinner
      class="spinner"
      ref="spinner"
      display="block"
      size="34px"
      default-state="hidden"
    >
    </loading-spinner>
    <button
      v-if="status != 'active' && !hideButton"
      class="btn"
      :style="{
        marginTop: status == 'error' ? '15px' : undefined,
      }"
      @click="onButtonClick"
    >
      {{ status == "error" ? "Retry" : "More" }}
    </button>
  </div>
</template>

<script>
import Vue from "vue";

import LoadingSpinner from "../shared/LoadingSpinner.vue";

export default Vue.extend({
  components: {
    LoadingSpinner,
  },

  props: {
    promise: { type: Promise, required: false },
    hideButton: { type: Boolean, required: false },
  },

  data() {
    return {
      status: "inactive", // inactive | active | error
    };
  },

  mounted() {
    this.observe(this.promise);
  },

  watch: {
    promise(value) {
      this.observe(value);
    },
  },

  methods: {
    observe(promise) {
      this.$refs.spinner.observe(promise);
      if (promise != null) {
        this.status = "active";
        this.promise
          .then(() => {
            if (promise == this.promise) {
              this.status = "inactive";
            }
          })
          .catch((e) => {
            if (promise == this.promise) {
              this.status = "inactive";
            }
          });
      } else {
        this.status = "inactive";
      }
    },

    onButtonClick(e) {
      if (this.status != "active") {
        this.$emit("fetch-requested");
      }
    },
  },
});
</script>

<style scoped>
._more-button {
  display: inline-flex;
  width: 125px;
  min-height: 36px;

  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn {
  font-size: 14px;
  width: 125px;
  height: 32px;
  box-sizing: border-box;

  background-color: #3b342c;
  border: 1px solid #5b5145;
  border-radius: 1px;
  color: #cdcdcd;
  outline: none;
}

.btn:active {
  filter: brightness(80%);
}
</style>
