<template>
  <div>
    <table style="overflow-x: scroll" class="spacing-top">
      <tr>
        <th>#</th>
        <th>match</th>
        <th>1</th>
        <th>x</th>
        <th>2</th>
        <th>bet</th>
        <th>bank</th>
      </tr>

      <tr v-for="(match, index) in data" :key="index + '-' + match.match">
        <td style="font-size: 10px; color: gray; text-align: center">
          <template v-if="name">{{ name.slice(0, 3) }}</template>
          <span class="d-block">{{ index + 1 }}</span>
        </td>
        <td>{{ match.match }}</td>
        <td
          :class="{
            win: match['1-bool'],
            'bet-event': betEventHandle1(match),
          }"
        >
          {{ match["1"] }}
        </td>
        <td
          :class="{
            win: match['x-bool'],
            'bet-event':
              (betOn.draw && !rangeActive) ||
              (isOddInRange(match['x'], oddRange) && betOn.draw) ||
              (!betOn.draw &&
                rangeActive &&
                isOddInRange(match['x'], oddRange)),
          }"
        >
          {{ match["x"] }}
        </td>
        <td
          :class="{
            win: match['2-bool'],
            'bet-event': betEventHandle2(match),
          }"
        >
          {{ match["2"] }}
        </td>
        <td>{{ match.bet }}</td>
        <td>{{ match.bank }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import isEmptyObject from "../utility/isEmptyObject";
export default {
  name: "Table",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
    },
    selectedBetType: {
      type: String,
    },
    rangeActive: {
      type: Boolean,
      required: true,
    },
    betOn: {
      type: Object,
      default: () => {},
    },
    oddRange: {
      type: Object,
      default: () => {},
    },
    // isOddInRange: {
    //   type: Function,
    //   default: () => {},
    // },
  },
  methods: {
    isOddInRange(odd, oddRange) {
      if (!this.rangeActive) {
        return false;
      }
      if (!isEmptyObject(oddRange)) {
        return oddRange.min <= odd && odd <= oddRange.max;
      }
      return false;
    },
    betEventHandle1(match) {
      const compare1 = !this.rangeActive && this.betOn.win && match.home;
      const compare2 = !this.rangeActive && this.betOn.loss && !match.home;
      const compare3 =
        this.isOddInRange(match["1"], this.oddRange) &&
        ((this.betOn.win && match.home) || (this.betOn.loss && !match.home));
      const compare4 =
        !this.selectedBetType &&
        this.rangeActive &&
        this.isOddInRange(match["1"], this.oddRange);
      const compareAll = compare1 || compare2 || compare3 || compare4;
      return compareAll;
    },
    betEventHandle2(match) {
      const compare4 =
        !this.selectedBetType &&
        this.rangeActive &&
        this.isOddInRange(match["2"], this.oddRange);
      return (
        (!this.rangeActive && this.betOn.win && !match.home) ||
        (!this.rangeActive && this.betOn.loss && match.home) ||
        (this.isOddInRange(match["2"], this.oddRange) &&
          ((this.betOn.win && !match.home) ||
            (this.betOn.loss && match.home))) ||
        compare4
      );
    },
  },
  // data() {
  //   return {
  //     betInput: this.bet,
  //   };
  // },
  // watch: {
  //   betInput() {
  //     this.$emit('bet-input', this.betInput);
  //   },
  // },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.win {
  background: lightyellow;
}
.bet-event {
  border: 1px dashed lighten(gray, 10%);
}
.win.bet-event {
  background: lawngreen;
}
tr:nth-child(odd) {
  background-color: rgba(black, 0.06);
}
td {
  padding: 4px;
}
</style>
