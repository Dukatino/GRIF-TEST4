<template>
  <div class="filter-overlay" v-if="showOverlay">
    <div class="filter-content">
      <!-- Place your filter options here -->
      <div class="filter-option" v-for="filter in filters" :key="filter">
        <label>
          <input type="checkbox" v-model="selectedFilters" :value="filter" />
          {{ filter }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filters: Array,
    selectedFilters: Array,
  },
  computed: {
    showOverlay: {
      get() {
        return this.selectedFilters.length === 0;
      },
      set(newValue) {
        if (newValue) {
          this.$emit("close");
        }
      },
    },
  },
};
</script>
