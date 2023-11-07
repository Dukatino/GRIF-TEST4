<template>
  <div>
    <label for="teamSelect" class="team-selector-label">
      <h4 style="display: inline">Selected Teams:</h4>
      <label for="toggle-all" style="display: inline-block" class="spacing">
        <input
          type="checkbox"
          name="toggle-all"
          id="toggle-all"
          v-model="selectAll"
          @change="toggleSelectAll"
        />
        Select all/none
      </label>
    </label>
    <div class="team-selector">
      <multiselect
        v-model="selectedLocally"
        @input="updateSelectedTeams"
        :options="data"
        :multiple="true"
        :close-on-select="false"
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
    teams: {
      type: Array,
      required: true,
    },
    selectedTeams: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      data: this.teams,
      selectedLocally: this.selectedTeams,
      selectAll: true,
    };
  },
  methods: {
    updateSelectedTeams() {
      this.$emit("update:selectedTeams", this.selectedLocally);
    },
    toggleSelectAll() {
      if (this.selectAll) {
        // Select all teams
        this.selectedLocally = this.data.slice();
      } else {
        // Deselect all teams
        this.selectedLocally = [];
      }
      this.updateSelectedTeams();
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