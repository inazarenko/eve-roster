<!--

A table of PaymentTriageRow. Used when paying reimbursements to players.

-->

<template>
  <div class="_payment-triage">
    <div class="toolbar">
      <div class="selector-cnt">
        <div class="selector-label">Paying with</div>
        <character-selector
          :accountId="identity.account.id"
          v-model="payingCharacter"
        >
        </character-selector>
      </div>
      <div class="liability-summary">
        <span class="liability-label">Approved liability:</span>
        <span class="liability-value">{{ approvedLiabilityDisplay }}</span>
        <span class="liability-denom">ISK</span>
      </div>
    </div>

    <template v-if="payments != null">
      <div class="top-line"></div>

      <payment-triage-row
        v-for="payment in payments"
        :key="payment.id"
        :payment="payment"
        :paying-character="payingCharacter"
      >
      </payment-triage-row>

      <div class="no-results" v-if="payments.length == 0">No results</div>
    </template>

    <div v-if="suspectMoreToFetch" class="more-cnt">
      <more-button
        :promise="fetchPromise"
        :hide-button="payments == null"
        @fetch-requested="fetchNextResults"
      >
      </more-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import CharacterSelector from "./CharacterSelector.vue";
import MoreButton from "./MoreButton.vue";
import PaymentTriageRow from "./PaymentTriageRow.vue";

import ajaxer from "../shared/ajaxer";
import { NameCacheMixin } from "../shared/nameCache";

const RESULTS_PER_FETCH = 30;

export default Vue.extend({
  components: {
    CharacterSelector,
    MoreButton,
    PaymentTriageRow,
  },

  props: {
    identity: { type: Object, required: true },
  },

  computed: {
    finalId() {
      if (!this.payments || this.payments.length == 0) {
        return undefined;
      } else {
        return this.payments[this.payments.length - 1].id;
      }
    },

    approvedLiabilityDisplay() {
      if (!this.approvedLiability) {
        return "0";
      } else {
        return this.approvedLiability.toLocaleString();
      }
    },
  },

  data() {
    return {
      fetchPromise: null,
      suspectMoreToFetch: true,

      payments: null,
      payingCharacter: null,

      approvedLiability: 0,
    };
  },

  mounted() {
    this.fetchNextResults();

    ajaxer.getSrpApprovedLiability().then((response) => {
      this.approvedLiability = response.data.approvedLiability;
    });
  },

  methods: Object.assign(
    {
      fetchNextResults() {
        this.fetchPromise = ajaxer.getSrpPaymentHistory({
          paid: false,
          order: "asc",
          orderBy: "id",
          startingAfter: this.finalId,
          account: this.forAccount,
          limit: RESULTS_PER_FETCH,
        });

        this.fetchPromise.then((response) => {
          this.addNames(response.data.names);

          this.payments = this.payments || [];
          for (let payment of response.data.payments) {
            this.payments.push(payment);
          }

          this.suspectMoreToFetch =
            response.data.payments.length == RESULTS_PER_FETCH;
        });
      },
    },
    NameCacheMixin
  ),
});
</script>

<style scoped>
._payment-triage {
  margin-bottom: 300px;
}

.toolbar {
  display: flex;
  margin: 40px 0;
  align-items: center;
}

.selector-cnt {
  display: flex;
  flex: 1;
  align-items: center;
}

.selector-label {
  font-size: 14px;
  color: #a7a29c;
  margin-right: 10px;
}

.liability-summary {
  font-size: 14px;
}

.liability-label {
  color: #a7a29c;
}

.liability-denom {
  color: #8b8b8b;
}

.top-line {
  border-bottom: 1px solid #2c2c2c;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;

  color: #a7a29c;
  font-size: 14px;
  font-style: italic;
}

.more-cnt {
  margin-top: 20px;
  text-align: center;
}
</style>
