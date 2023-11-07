<template>
  <div class="range-odds-count" :style="disabled ? 'opacity:0.3;' : ''">
    <span>Odds </span>
    <range-selector
      v-model="selectedRange"
      :range="selectedRange"
      :disabled="disabled"
    >
      <template v-slot:min-label> min: </template>
      <template v-slot:max-label> max: </template>
    </range-selector>
    <span class="text-xs">
      (converted count: <b>{{ oddsRangeCount ? oddsRangeCount : "-" }}</b>
      <span v-if="oddsRangeCount && oddsCount" style="font-size: 12px"
        >'out of' {{ oddsCount }}</span
      >)
    </span>
  </div>
</template>

<script>
import RangeSelector from "./RangeSelector";

export default {
  components: {
    RangeSelector,
  },
  props: {
    range: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    oddsCount: {
      type: Number,
      default: null,
    },
    oddsRangeCount: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      selectedRange: {
        min: 0,
        max: 0,
      },
    };
  },

  watch: {
    selectedRange: {
      handler() {
        this.$emit("range", this.selectedRange);
      },
      deep: true,
    },
    range: {
      handler() {
        this.selectedRange = this.range;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {},
};
</script>
