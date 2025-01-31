<template>
  <admin-wrapper title="Setup" :identity="identity">
    <textarea
      class="main-input"
      v-model="setupJson"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    ></textarea>
    <div style="margin-top: 8px">
      <button
        class="roster-btn submit-btn"
        :enabled="!savingSetup"
        @click="onSubmitClick"
      >
        Submit
      </button>
      <loading-spinner
        class="spinner"
        ref="spinner"
        display="block"
        size="34px"
      >
      </loading-spinner>
    </div>

    <div class="section-title">SRP</div>
    <srp-setup></srp-setup>
  </admin-wrapper>
</template>

<script>
import Promise from "bluebird";
import moment from "moment";

import ajaxer from "../shared/ajaxer";

import AdminWrapper from "./AdminWrapper.vue";
import LoadingSpinner from "../shared/LoadingSpinner.vue";
import SrpSetup from "./setup/SrpSetup.vue";

const JSON_COMMENT_PATTERN = /\s*\/\/[^\n]*\n?/g;

export default {
  components: {
    AdminWrapper,
    LoadingSpinner,
    SrpSetup,
  },

  props: {
    identity: { type: Object, required: true },
  },

  data() {
    return {
      setupJson: "",
      savingSetup: false,
    };
  },

  mounted() {
    this.$refs.spinner.observe(ajaxer.getAdminSetup()).then((response) => {
      this.setupJson = JSON.stringify(response.data, null, 2);
    });
  },

  methods: {
    onSubmitClick() {
      if (this.savingSetup) {
        return;
      }
      this.savingSetup = true;

      this.$refs.spinner
        .observe(
          Promise.resolve()
            .then(() => {
              let cleanedJson = this.setupJson.replace(
                JSON_COMMENT_PATTERN,
                ""
              );
              return JSON.parse(cleanedJson);
            })
            .then((setupJson) => {
              return ajaxer.putAdminSetup(setupJson);
            })
        )
        .finally(() => {
          this.savingSetup = false;
        });
    },
  },
};
</script>

<style scoped>
.main-input {
  width: 720px;
  height: 600px;
  font-family: monospace;
  font-size: 14px;
  color: #cdcdcd;
  background: #1b1b1b;
  border: 1px solid #584732;
  padding: 8px;
}

.main-input:focus {
  outline: none;
  border-color: #7b5f3a;
}

.submit-btn {
  width: 115px;
  height: 38px;
  font-size: 14px;
}

.spinner {
  margin-top: 8px;
}

.section-title {
  font-size: 20px;
  color: #a7a29c;
  margin: 50px 0 20px;
}
</style>
