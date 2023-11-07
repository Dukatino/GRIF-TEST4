<template>
  <tr>
    <td style="font-size: 10px; color: gray; text-align: center">
      <span class="d-block">{{ match.id + 1 }}</span>
    </td>
    <td>{{ match.match }}</td>
    <td
      :class="{
        win: match['1-bool'],
        'bet-event':
          parallelBets.length > 1 &&
          highestBet === match['1'] &&
          isBetEvent('1'),
      }"
    >
      {{ match["1"] }}
    </td>
    <td
      :class="{
        win: match['x-bool'],
        'bet-event':
          parallelBets.length > 1 &&
          highestBet === match['x'] &&
          isBetEvent('x'),
      }"
    >
      {{ match["x"] }}
    </td>
    <td
      :class="{
        win: match['2-bool'],
        'bet-event':
          parallelBets.length > 1 &&
          highestBet === match['2'] &&
          isBetEvent('2'),
      }"
    >
      {{ match["2"] }}
    </td>
    <td v-if="match['score']">
      {{ match["1-score"] }}-{{ match["2-score"] }} ({{ match["score"] }})
    </td>
    <td
      :style="
        match.bet.length > 1
          ? 'display: flex; flex-direction: column; align-items:center; font-size: 10px;'
          : ''
      "
    >
      <span v-for="(bet, index) in match.bet" :key="index"> {{ bet }}</span>
    </td>

    <template v-if="martingaleEnabled">
      <td>{{ match.martingaleDebt }}</td>
      <td>{{ match.martingaleCurrentBetRound }}</td>
    </template>

    <td>{{ match.bank }}</td>
  </tr>
</template>

<script>
import isEmptyObject from "../utility/isEmptyObject";

export default {
  props: {
    match: {
      type: Object,
      default: () => {},
    },
    rangeActive: {
      type: Boolean,
      required: true,
    },
    martingaleEnabled: {
      type: Boolean,
      required: true,
    },
    selectedBetType: {
      type: String,
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
  // data() {
  //   return {
  //     isVisible: false,
  //   };
  // },
  computed: {
    parallelBets() {
      if (this.rangeActive && this.martingaleEnabled) {
        const parallelBets = ["1", "x", "2"].filter((type) =>
          this.isBetEvent(type)
        );
        return parallelBets;
      }
      return [];
    },
    highestBet() {
      const highestBet = Math.max(
        this.parallelBets.map((bet) => this.match[bet])
      );
      return highestBet;
    },
  },
  methods: {
    isBetEvent(event) {
      // ONLY BET TYPE EVENT
      if (!this.rangeActive && this.selectedBetType && this.betOn[event]) {
        return true;
      }
      // ONLY RANGE EVENT
      if (
        this.rangeActive &&
        !this.selectedBetType &&
        !this.betOn[event] &&
        this.isOddInRange(this.match[event], this.oddRange)
      ) {
        return true;
      }
      // RANGE + BET TYPE EVENT
      if (
        this.rangeActive &&
        this.selectedBetType &&
        this.betOn[event] &&
        this.isOddInRange(this.match[event], this.oddRange)
      ) {
        return true;
      }
      return false;
    },
    isOddInRange(odd, oddRange) {
      if (!this.rangeActive) {
        return false;
      }
      if (!isEmptyObject(oddRange)) {
        return oddRange.min <= odd && odd <= oddRange.max;
      }
      return false;
    },
  },

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
td:nth-of-type(2) {
  min-width: 120px;
}
</style>
