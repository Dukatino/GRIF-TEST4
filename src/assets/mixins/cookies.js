import isEmptyObject from "../../utility/isEmptyObject";

const cookies = {
  created() {
    // this.$nextTick(() => {
    this.oddsRangeFilter =
      this.getCookieObjectArray("oddsRangeFilter") || this.oddsRangeFilter;
    this.betOn = this.getCookieObjectArray("betOn");
    this.selectedTeams =
      this.getCookieObjectArray("selectedTeams") || this.selectedTeams;
    this.bet = this.getCookie("bet") || this.bet;

    // });
  },
  watch: {
    betOn: {
      handler() {
        // this.setCookie('betOn', this.betOn);
        document.cookie = `betOn=${JSON.stringify(this.betOn)}`;
      },
      deep: true
    },
    oddsRangeFilter: {
      handler() {
        if (!isEmptyObject(this.oddsRangeFilter)) {
          document.cookie = `oddsRangeFilter=${JSON.stringify(
            this.oddsRangeFilter
          )}`;
        }
      },
      deep: true
    },
    selectedTeams: {
      handler() {
        if (this.selectedTeams.length) {
          document.cookie = `selectedTeams=${JSON.stringify(
            this.selectedTeams
          )}`;
        }
      },
      deep: true
    },
    bet(newBet) {
      this.setCookie("bet", newBet);
    }
  },
  methods: {
    setCookie(name, value) {
      document.cookie = `${name}=${value}`;
    },
    getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    },
    getCookieObjectArray(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return JSON.parse(parts.pop().split(";").shift());
      }
    }
  }
};

export default cookies;
