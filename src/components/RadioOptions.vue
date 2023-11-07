<template>
  <div class="radio-options" :style="disabled ? 'opacity: 0.3;' : ''">
    <label
      class="spacing-right"
      v-for="(option, index) in options"
      :key="index"
    >
      <div style="text-align: center">{{ option }}</div>
      <input
        :disabled="disabled"
        type="radio"
        :id="option"
        :value="option"
        v-model="selectedOption"
      />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    selected: {
      type: String,
      default: "win",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedOption: this.selected,
    };
  },
  watch: {
    selected(newVal) {
      this.selectedOption = newVal;
    },
    selectedOption(newOption) {
      this.$emit("selected", newOption);
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-options {
  display: flex;
  flex-wrap: wrap;
}
</style>