const urlHandler = {
  watch: {
    "oddsRangeFilter.min": "updateURL",
    "oddsRangeFilter.max": "updateURL",
    betOn: "updateURL",
    "betOnRosters.1": "updateURL",
    "betOnRosters.2": "updateURL",
    "betOnRosters.x": "updateURL",
    rangeActive: "updateURL",
    selectedBetOn: "updateURL",
    selectedDataset: "updateURL"
  },
  methods: {
    updateURL() {
      const params = {};

      if (this.isGroupOneSelected()) {
        for (const prop in this.betOn) {
          if (this.betOn[prop]) {
            params["beton"] = prop;
          }
        }
      } else {
        for (const prop in this.betOnRosters) {
          if (this.betOnRosters[prop]) {
            params["betonrosters"] = prop;
          }
        }
      }

      if (this.rangeActive) {
        params["min"] = this.oddsRangeFilter.min;
        params["max"] = this.oddsRangeFilter.max;
      }

      if (this.selectedDataset) {
        params["dataset"] = this.selectedDataset;
      }

      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

      window.history.pushState(null, null, `?${queryString}`);
    },
    isGroupOneSelected() {
      return ["win", "loss", "draw"].includes(this.selectedBetOn);
    }
  },
  created() {
    this.$nextTick(() => {
      const queryParams = new URLSearchParams(window.location.search);
      this.rangeActive = queryParams.get("rangeActive") === "true";

      if (this.isGroupOneSelected()) {
        for (const prop in this.betOn) {
          this.betOn[prop] = queryParams.get("beton") === prop;
          if (queryParams.get("beton") === prop) {
            this.setBetOn(prop);
          }
        }
      } else {
        for (const prop in this.betOnRosters) {
          this.betOnRosters[prop] = queryParams.get("betonrosters") === prop;
          if (queryParams.get("betonrosters") === prop) {
            this.setBetOn(prop);
          }
        }
      }

      if (this.rangeActive) {
        this.oddsRangeFilter.min = parseInt(queryParams.get("min")) || 1;
        this.oddsRangeFilter.max = parseInt(queryParams.get("max")) || 10;
      }

      this.selectedDataset = queryParams.get("dataset"); // Read and assign selectedDataset

      this.updateURL();
    });
  }
};
export default urlHandler;
