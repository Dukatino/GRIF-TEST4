<template>
  <div class="range-selector">
    <label for="min"><slot name="min-label">Odd min:</slot></label>
    <input
      :disabled="disabled"
      class="input"
      type="number"
      id="min"
      v-model="minValue"
      @input="updateRange"
    />

    <label for="max"><slot name="max-label">Odd max:</slot></label>
    <input
      :disabled="disabled"
      class="input"
      type="number"
      id="max"
      v-model="maxValue"
      @input="updateRange"
    />
  </div>
</template>

<script>
export default {
  props: {
    range: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      minValue: null,
      maxValue: null,
    };
  },
  watch: {
    range: {
      handler() {
        if (this.range) {
          this.minValue = this.range.min;
          this.maxValue = this.range.max;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    updateRange() {
      this.$emit("input", {
        min: parseFloat(this.minValue),
        max: parseFloat(this.maxValue),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.input {
  width: 35px;
}
.range-selector {
  display: inline-block;
}
</style>
