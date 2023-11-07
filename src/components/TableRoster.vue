<template>
  <div class="table-roster">
    <div
      class="table-scroller"
      ref="scrollContainer"
      @scroll="handleScroll"
      style="overflow-y: auto"
    >
      <table class="spacing-top" ref="container">
        <thead>
          <tr>
            <th>#</th>
            <th>match</th>
            <th>1</th>
            <th>x</th>
            <th>2</th>
            <th v-if="visibleMatches[0]['score']">score</th>
            <th>bet</th>
            <template v-if="martingaleEnabled">
              <th>mart debt</th>
              <th>mlr</th>
            </template>
            <th>bank</th>
          </tr>
        </thead>
        <tbody>
          <TableRow
            v-for="match in visibleMatches"
            :key="match.id"
            class="item-height"
            :match="match"
            :bet-on="betOn"
            :odd-range="oddRange"
            :is-odd-in-range="isOddInRange"
            :range-active="rangeActive"
            :martingale-enabled="martingaleEnabled"
            :selected-bet-type="selectedBetType"
          ></TableRow>
        </tbody>
      </table>
    </div>
    <div v-if="loading" style="text-align: center">Loading...</div>
  </div>
</template>

<script>
import TableRow from "./TableRow";
import isEmptyObject from "../utility/isEmptyObject";

export default {
  components: {
    TableRow,
  },
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
      required: true,
    },
    rangeActive: {
      type: Boolean,
      required: true,
    },
    martingaleEnabled: {
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
  data() {
    return {
      visibleMatches: [],
      itemsPerPage: 30, // Adjust the number of items per chunk as per your requirements
      currentPage: 0,
      loading: false,
    };
  },
  computed: {
    totalChunks() {
      return Math.ceil(this.data.length / this.itemsPerPage);
    },
  },
  watch: {
    data: {
      handler(newData) {
        // Reset visibleMatches when data prop changes
        this.visibleMatches = newData.slice(0, this.itemsPerPage);
        this.currentPage = 1;
      },
      immediate: true, // Trigger the watcher immediately on component creation
    },
  },
  // created() {
  //   // Initialize visibleItems with the first batch of data
  //   const initialItems = this.data.slice(0, this.itemsPerPage);
  //   this.visibleItems = initialItems;
  //   this.lastIndex = this.itemsPerPage;
  // },
  // mounted() {
  //   // Initial setup
  //   this.visibleMatches = this.data.slice(0, this.itemsPerPage);
  // },
  methods: {
    async handleScroll() {
      const container = this.$refs.scrollContainer;
      const atBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 1;

      if (atBottom && !this.loading) {
        this.loading = true;

        // Simulate loading delay (replace with actual data fetching)
        setTimeout(() => {
          this.currentPage++;
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = this.currentPage * this.itemsPerPage;

          // Append the next batch of items to visibleItems
          this.visibleMatches = this.visibleMatches.concat(
            this.data.slice(startIndex, endIndex)
          );

          this.loading = false;
        }); // Simulated loading delay
      }
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.table-roster {
  overflow: hidden;
  position: relative;
}

.table-scroller {
  max-height: 650px;
  width: 100vw;
  overflow: scroll;
}

table {
  width: 100%;
}
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
