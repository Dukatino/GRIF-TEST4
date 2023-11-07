<template>
  <div>
    <label for="dataSelect" class="data-selector-label">
      <h4 style="display: inline">Selected dataset:</h4>
    </label>
    <div class="data-selector spacing-top">
      <multiselect
        v-model="selectedLocally"
        @input="updateSelectedData"
        :options="data"
        :hide-selected="true"
        :searchable="false"
        :max-height="220"
      ></multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  props: {
    datasets: {
      type: Array,
      required: true,
    },
    selectedDataset: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data: this.datasets,
      selectedLocally: this.selectedDataset,
    };
  },
  watch: {
    selectedDataset() {
      this.selectedLocally = this.selectedDataset;
    },
  },
  methods: {
    updateSelectedData() {
      this.$emit("update:selectedDataset", this.selectedLocally);
    },
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
/* Styling for the select label */

.multiselect__tags {
  /* max-height: 200px; */
  overflow: scroll;
  font-size: 12px;
}
</style>