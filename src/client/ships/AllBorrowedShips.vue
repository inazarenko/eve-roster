<template>
  <ships-wrapper title="All borrowed corp ships" :identity="identity">
    <loading-spinner
      class="main-spinner"
      ref="spinner"
      defaultState="hidden"
      size="34px"
    />
    <ship-table :ships="ships" :showMainCharacter="true" />
  </ships-wrapper>
</template>

<script>
import ajaxer from "../shared/ajaxer";

import ShipsWrapper from "./ShipsWrapper.vue";
import ShipTable from "./ShipTable.vue";
import LoadingSpinner from "../shared/LoadingSpinner.vue";

export default {
  components: {
    ShipsWrapper,
    ShipTable,
    LoadingSpinner,
  },

  props: {
    identity: { type: Object, required: true },
  },

  data: function () {
    return {
      ships: [],
    };
  },

  mounted: function () {
    this.$refs.spinner
      .observe(ajaxer.getAllBorrowedShips())
      .then((response) => {
        this.ships = response.data;
      });
  },
};
</script>
