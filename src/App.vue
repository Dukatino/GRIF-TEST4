<template>
  <div id="app">
    <button
      type="button"
      class="filter-button spacing-right d-flex items-center"
      @click="open"
    >
      <img
        src="./assets/graphics/icons/icon-cog.svg"
        alt=""
        style="width: 16px"
      />
      &nbsp;Settings
    </button>
    <BottomSheet ref="bottomSheet">
      <div class="spacing" style="margin-bottom: 100px">
        <div class="d-flex">
          <div>
            <b class="d-block ml-4">{{ srajtofla }} </b>
            <div class="d-inline-flex lh-1 flex-wrap">
              <span class="text-xxs spacing-left-sm"
                >adj.: {{ oddsPercentageAdjustment * 100 }}%</span
              >
              <span class="d-inline-flex text-xxs spacing-left-sm"
                >&nbsp;|&nbsp;
                <span>highest bet: {{ insights.highestBet }}</span></span
              >
              <span class="d-inline-flex text-xxs spacing-left-sm"
                >&nbsp;|&nbsp;
                <span>highest bank: {{ insights.highestBank }}</span></span
              >
              <span class="d-inline-flex text-xxs spacing-left-sm"
                >&nbsp;|&nbsp;
                <span>lowest bank: {{ insights.lowestBank }}</span></span
              >
              <span
                v-if="
                  rangeActive &&
                  oddsRangeFilter &&
                  oddsRangeFilter.min &&
                  oddsRangeFilter.max
                "
                class="d-inline-flex text-xxs spacing-left-sm"
              >
                &nbsp;|&nbsp;
                <span>won range events: {{ oddsRangeCount }}</span>
                &nbsp;|&nbsp;
                <span>bet event count: {{ insights.betEventCount }}</span>
                &nbsp;|&nbsp;
                <span
                  >conv. rate:
                  {{
                    Math.round(
                      (oddsRangeCount * 1000) / insights.betEventCount
                    ) / 10
                  }}</span
                >
              </span>

              <span
                v-if="!rangeActive && insights && insights.convertedodds"
                class="text-xxs spacing-left-sm"
              >
                <span
                  >| converted odds: {{ insights.convertedodds.length }}</span
                >
              </span>
              <span
                v-if="oddsInsights && oddsInsights.hasOwnProperty('count')"
                class="text-xxs spacing-left-sm"
                >| all match events: {{ allMatchEventsCount }}</span
              >
              <span
                v-if="oddsInsights && oddsInsights.hasOwnProperty('mean')"
                class="text-xxs spacing-left-sm"
              >
                | mean av.: {{ oddsInsights.mean }}</span
              >
              <span
                v-if="oddsInsights && oddsInsights.hasOwnProperty('median')"
                class="text-xxs spacing-left-sm"
              >
                | median av.: {{ oddsInsights.median }}</span
              >
            </div>
          </div>
          <!-- <div class="spacing-left" v-show="Number(bank) > 0">
            <img src="./assets/graphics/money.gif" alt="" style="width: 50px" />
          </div> -->
        </div>
        <DatasetSelector
          class="spacing-top"
          :selected-dataset="selectedDataset"
          :datasets="listOfDatasets"
          @update:selectedDataset="setSelectedDataset"
        />
        <label class="d-block spacing-top" for="beton"
          ><input
            type="checkbox"
            id="beton"
            name="beton"
            v-model="betOnActive"
            @click="betOnActive = !betOnActive"
          />&nbsp;Bet on 1/x/2</label
        >
        <RadioOptions
          class="spacing-top"
          @selected="handleBetOnType"
          :selected="selectedBetType"
          :options="betOnOptions"
          :disabled="!betOnActive"
        />
        <label class="d-block spacing-top" for="score"
          ><input
            type="checkbox"
            id="score"
            name="score"
            v-model="betOnScoreActive"
            @click="betOnScoreActive = !betOnScoreActive"
          />&nbsp;Bet on Score</label
        >
        <RadioOptions
          class="spacing-top"
          @selected="handleScoreType"
          :selected="selectedScoreType"
          :options="scoreOptions"
          :disabled="!betOnScoreActive"
        />
        <label class="d-block spacing-top" for="range"
          ><input
            type="checkbox"
            id="range"
            name="range"
            v-model="rangeActive"
            @click="rangeActive = !rangeActive"
          />&nbsp;Range</label
        >

        <RangeOddsCount
          :disabled="!rangeActive"
          :range="oddsRangeFilter"
          @range="setOddsRangeFilter"
          :odds-range-count="oddsRangeCount"
          :odds-count="oddsInsightsCount"
        />
        <label class="spacing-top d-block" for="martingale-toggle">
          <input
            type="checkbox"
            id="martingale-toggle"
            v-model="martingaleEnabled"
          />
          Martingale
        </label>
        <div :style="!martingaleEnabled ? 'opacity: 0.3;' : ''">
          <label for="stop-round"
            >Hand-brake round:
            <input
              :disabled="!martingaleEnabled"
              class="input"
              type="number"
              id="stop-round"
              v-model="martingaleHardStopRound"
            />
          </label>
          <label for="money-per-match"
            >Money for win:
            <input
              :disabled="!martingaleEnabled"
              class="input"
              type="number"
              id="money-per-match"
              v-model="martingaleMoneyPerMatch"
            />
          </label>
        </div>

        <div
          :style="martingaleEnabled ? 'opacity: 0.3;' : ''"
          class="spacing-top"
        >
          <h4>Bet:</h4>
          <input
            :disabled="martingaleEnabled"
            class="spacing-top"
            style="max-width: 50px"
            type="number"
            v-model="setBet"
          /><span> €</span>
        </div>

        <TeamSelector
          v-if="!isEmptyObject(teamsYearDataset)"
          class="spacing-top"
          :selected-teams="selectedTeams"
          :teams="listOfTeams"
          @update:selectedTeams="setSelectedTeams"
        />
        <!-- <ToggleMode /> -->
      </div>
    </BottomSheet>
    <div class="bank" v-cloak>
      <div class="text-xxs">{{ selectedDataset }}</div>
      <div class="d-flex flex-column">
        <div class="d-flex justify-center flex-wrap">
          <span v-if="rangeActive || selectedBetType">
            <b class="inline-block ml-4">{{ srajtofla }} </b>
          </span>
          <span v-if="rangeActive || selectedBetType"
            >&nbsp;| BET ON&nbsp;</span
          >
          <span v-if="rostersDataMapped.length">
            <template v-if="betOnRosters['1']">1</template>
            <template v-else-if="betOnRosters['2']">2</template>
            <template v-else-if="betOnRosters['x']">X</template>
            <template v-if="rangeActive && selectedBetType"> & &nbsp;</template>
          </span>
          <span v-else>
            <template v-if="betOn.win">WIN</template>
            <template v-else-if="betOn.loss">LOSS</template>
            <template v-else-if="betOn.draw">DRAW</template>
            <template v-if="rangeActive && selectedBetType"> &&nbsp;</template>
          </span>
          <span v-if="rangeActive">
            RANGE
            <span class="text-xs"
              >({{ oddsRangeFilter.min }}-{{ oddsRangeFilter.max }})</span
            ></span
          >
          <span v-if="!rangeActive && !selectedBetType">SELECT BET TYPE</span>
        </div>
        <template v-if="rangeActive || selectedBetType">
          <div class="d-flex lh-1 justify-center flex-wrap">
            <span class="text-xxs spacing-left-sm"
              >adj.: {{ oddsPercentageAdjustment * 100 }}%</span
            >
            <span class="d-inline-flex text-xxs spacing-left-sm"
              >&nbsp;|&nbsp;
              <span>highest bet: {{ insights.highestBet }}</span></span
            >
            <span class="d-inline-flex text-xxs spacing-left-sm"
              >&nbsp;|&nbsp;
              <span>highest bank: {{ insights.highestBank }}</span></span
            >
            <span class="d-inline-flex text-xxs spacing-left-sm"
              >&nbsp;|&nbsp;
              <span>lowest bank: {{ insights.lowestBank }}</span></span
            >
            <span
              v-if="
                rangeActive &&
                oddsRangeFilter &&
                oddsRangeFilter.min &&
                oddsRangeFilter.max
              "
              class="d-inline-flex text-xxs spacing-left-sm"
            >
              &nbsp;|&nbsp;
              <span>won range events: {{ oddsRangeCount }}</span>
              &nbsp;|&nbsp;
              <span>bet event count: {{ insights.betEventCount }}</span>
              &nbsp;|&nbsp;
              <span
                >conv. rate:
                {{
                  Math.round((oddsRangeCount * 1000) / insights.betEventCount) /
                  10
                }}</span
              >
            </span>
            <span
              v-if="!rangeActive && insights && insights.convertedodds"
              class="text-xxs spacing-left-sm"
            >
              <span>| converted: {{ insights.convertedodds.length }}</span>
            </span>
            <span
              v-if="oddsInsights && oddsInsights.hasOwnProperty('count')"
              class="text-xxs spacing-left-sm"
              >| all match events: {{ allMatchEventsCount }}</span
            >
            <span
              v-if="oddsInsights && oddsInsights.hasOwnProperty('mean')"
              class="text-xxs spacing-left-sm"
              >| mean av.: {{ oddsInsights.mean }}</span
            >
            <span
              v-if="oddsInsights && oddsInsights.hasOwnProperty('median')"
              class="text-xxs spacing-left-sm"
            >
              | median av.: {{ oddsInsights.median }}</span
            >
          </div>
          <div class="d-flex lh-1 justify-center"></div>
        </template>
      </div>
    </div>

    <div class="tables">
      <template v-if="teamsDataFiltered">
        <div v-for="(data, name) in teamsDataFiltered" :key="name">
          <Table
            :data="data"
            :name="name"
            :bet-on="betOn"
            :odd-range="oddsRangeFilter"
            :is-odd-in-range="isOddInRange"
            :range-active="rangeActive"
            :selected-bet-type="selectedBetType"
          />
        </div>
      </template>
      <template v-if="rostersDataMapped.length">
        <div v-for="(data, index) in rostersDataMapped" :key="index">
          <TableRoster
            :data="data"
            :bet-on="betOnRosters"
            :odd-range="oddsRangeFilter"
            :is-odd-in-range="isOddInRange"
            :range-active="rangeActive"
            :martingale-enabled="martingaleEnabled"
            :selected-bet-type="selectedBetType"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Table from "./components/Table";
import TableRoster from "./components/TableRoster";
import RangeOddsCount from "./components/RangeOddsCount";
import RadioOptions from "./components/RadioOptions";
import TeamSelector from "./components/TeamSelector";
import DatasetSelector from "./components/DatasetSelector";
import BottomSheet from "@nclsm/vue-bottom-sheet-vue2";
import ToggleMode from "./components/ToggleMode.vue";
import { listOfTeams, listOfDatasets } from "./config";
import odds from "./assets/mixins/odds";
import urlHandler from "./assets/mixins/url-handler";
// import cookies from "./assets/mixins/cookies";
import findTrueObjectProperty from "./utility/findTrueObjectProperty";
import isEmptyObject from "./utility/isEmptyObject";

// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale
// } from 'chart.js'
// import { Bar } from 'vue-chartjs'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  name: "App",
  components: {
    Table,
    TableRoster,
    RangeOddsCount,
    RadioOptions,
    BottomSheet,
    TeamSelector,
    DatasetSelector,
    ToggleMode,
    // Bar,
  },
  // mixins: [odds, cookies],
  // mixins: [odds, urlHandler],
  mixins: [odds],
  data: function () {
    return {
      initMoney: 1,
      oddsPercentageAdjustment: 0.95,
      bank: 0,
      setBet: 0,
      bet: [],
      betRound: [0],
      srajtofla: 0,
      insights: {
        convertedodds: [],
        betEventCount: 0,
        highestBet: 0,
        highestBank: 0,
        lowestBank: 0,
      },

      pageSize: 10, // Number of items to load at once
      loadedRosters: 0, // Number of rosters already loaded
      betOn: {
        win: false,
        loss: false,
        draw: false,
      },
      betOnRosters: {
        1: false,
        2: false,
        x: false,
      },
      betOnScore: {
        "<8": false,
        "<6.5": false,
        "<7.5": false,
        "<7": false,
        "<6": false,
        ">6": false,
        ">6.5": true,
        ">7": false,
        ">7.5": false,
        ">8": false,
      },
      betOnActive: false,
      betOnScoreActive: false,
      rangeActive: false,
      allMatchEventsCount: 0,
      countRoasterYears: 0,
      selectedBetType: "",
      selectedScoreType: "",
      selectedTeams: listOfTeams,
      selectedDataset: "",
      teamsYearDataset: {},
      rostersAllDatasetArray: [],
      sandboxCtaHidden: false,
      martingaleEnabled: false,
      martingaleMoneyPerMatch: 10,
      martingaleCurrentDebt: 0,
      martingaleCurrentBetRound: 0,
      martingaleHardStopRound: 8, // Set the iteration count for hard stop
    };
  },
  computed: {
    listOfTeams: () => listOfTeams,
    listOfDatasets: () => listOfDatasets,
    betOnOptions() {
      return this.rostersAllDatasetArray.length
        ? ["1", "x", "2"]
        : ["win", "draw", "loss"];
    },
    scoreOptions() {
      return [
        "<8",
        "<6.5",
        "<7.5",
        "<7",
        "<6",
        ">6",
        ">6.5",
        ">7",
        ">7.5",
        ">8",
      ];
    },

    rostersDataMapped() {
      // WRONG RANGE
      if (
        !this.rostersAllDatasetArray.length ||
        (this.rangeActive &&
          (this.oddsRangeFilter.min >= this.oddsRangeFilter.max ||
            !this.oddsRangeFilter.min ||
            !this.oddsRangeFilter.max))
      ) {
        return [];
      }
      let newData = [];
      let moneyPerMatch = this.martingaleMoneyPerMatch;

      this.insights.highestBet = 0;
      this.insights.highestBank = 0;
      this.insights.lowestBank = 0;
      this.allMatchEventsCount = 0;
      this.countRoasterYears = 0;
      this.bank = 0;
      this.bet = [0];
      this.betRound = [0];
      this.martingaleCurrentDebt = 0;
      this.martingaleCurrentBetRound = 0;
      this.insights.convertedodds = [];
      this.insights.betEventCount = 0;
      this.resetStates();
      let id = 0;

      if (this.rostersAllDatasetArray.length) {
        for (let i = 0; i < this.rostersAllDatasetArray.length; i++) {
          this.countRoasterYears = this.rostersAllDatasetArray.length;
          this.allMatchEventsCount += this.rostersAllDatasetArray[i].length;

          if (this.martingaleCurrentDebt == 0) {
            this.bet = [];
          }

          newData[i] = this.rostersAllDatasetArray[i].map((match) => {
            // adjustments
            const adjustedOdd1 = this.getAdjustedOdd(match["1"]);
            const adjustedOddX = this.getAdjustedOdd(match["x"]);
            const adjustedOdd2 = this.getAdjustedOdd(match["2"]);

            if (!this.insights.convertedodds) {
              this.insights.convertedodds = [];
            }

            if (this.rangeActive) {
              // adjustments
              let winningOdd;
              let winningBetOn;

              // if (!this.martingaleEnabled) {
              //   this.betRound = 0;
              // }

              if (match["x-bool"]) {
                winningOdd = adjustedOddX;
                winningBetOn = "x";
              } else if (match["1-bool"]) {
                winningOdd = adjustedOdd1;
                winningBetOn = "1";
              } else if (match["2-bool"]) {
                winningOdd = adjustedOdd2;
                winningBetOn = "2";
              }

              let betTypeAndRangeOdds = [];

              if (!this.selectedBetType) {
                betTypeAndRangeOdds.push(
                  adjustedOdd1,
                  adjustedOddX,
                  adjustedOdd2
                );
              } else if (this.selectedBetType === "1") {
                betTypeAndRangeOdds.push(adjustedOdd1);
              } else if (this.selectedBetType === "x") {
                betTypeAndRangeOdds.push(adjustedOddX);
              } else if (this.selectedBetType === "2") {
                betTypeAndRangeOdds.push(adjustedOdd2);
              }

              const parallelBets = betTypeAndRangeOdds.filter((odd) =>
                this.isOddInRange(odd, this.oddsRangeFilter)
              );

              if (this.martingaleEnabled && parallelBets.length > 1) {
                // IN PARALLEL BETS, SELECT THE HIGHER ODD
                betTypeAndRangeOdds = [Math.max(parallelBets)];
              }

              betTypeAndRangeOdds.forEach((odd, index) => {
                if (index === 0) {
                  this.betRound = [];
                  this.bet = [];
                }

                // BET APPLYING
                if (this.isOddInRange(odd, this.oddsRangeFilter)) {
                  if (this.martingaleEnabled) {
                    this.martingaleCurrentBetRound++;

                    // HANDLE RESET
                    // HARD STOPPED OR WINNING ROUND
                    if (
                      this.martingaleCurrentBetRound >
                      this.martingaleHardStopRound
                    ) {
                      this.handleResetBets();
                    }

                    this.bet.push(
                      this.setMartingaleBets(odd, moneyPerMatch, "BET APPLYING")
                    );
                    if (
                      !this.selectedBetType &&
                      odd === winningOdd &&
                      this.isOddInRange(odd, this.oddsRangeFilter)
                    ) {
                      this.martingaleCurrentBetRound = 1;
                      this.martingaleCurrentDebt = 0;
                    }
                  } else {
                    // // HANDLE RESET
                    // this.handleResetBets();
                    this.bet.push(this.setBet);
                  }
                  this.betRound = this.bet;
                }

                // only range win applied
                if (
                  !this.selectedBetType &&
                  odd === winningOdd &&
                  this.isOddInRange(odd, this.oddsRangeFilter)
                ) {
                  const winningBetItem = this.betRound[
                    this.betRound.length - 1
                  ];

                  this.bank += winningBetItem * winningOdd;
                  // HANDLE RESET
                  this.handleResetBets();

                  this.insights.convertedodds.push(winningOdd);
                } else if (
                  !this.selectedBetType &&
                  odd !== winningOdd &&
                  this.isOddInRange(odd, this.oddsRangeFilter)
                ) {
                  if (this.martingaleEnabled) {
                    this.martingaleCurrentDebt +=
                      this.betRound[this.betRound.length - 1] || 0;
                  }
                }
              });

              // APPLIED BET TO BANK
              if (!parallelBets.length || parallelBets.length <= 1) {
                this.bank -= this.sumArray(this.betRound);
              }

              // if (this.martingaleEnabled ) {
              //   this.martingaleCurrentDebt += this.sumArray(this.betRound);
              // }

              if (
                !betTypeAndRangeOdds.length ||
                !betTypeAndRangeOdds.some((odd) =>
                  this.isOddInRange(odd, this.oddsRangeFilter)
                )
              ) {
                this.bet = [];
                this.betRound = [];
              }

              // winning range + bet type applying
              if (
                winningBetOn === this.selectedBetType &&
                this.isOddInRange(winningOdd, this.oddsRangeFilter)
              ) {
                if (this.martingaleEnabled) {
                  this.bet.push(
                    this.setMartingaleBets(
                      winningOdd,
                      moneyPerMatch,
                      "winning range + bet type applying"
                    )
                  );
                  this.martingaleCurrentDebt = 0;
                }

                const winningBetItem = this.betRound[this.betRound.length - 1];
                this.bank += winningBetItem * winningOdd;
                // HANDLE RESET
                this.handleResetBets();
                this.insights.convertedodds.push(winningOdd);
              }

              this.insights.betEventCount += betTypeAndRangeOdds.length;

              // console.log(
              //   match.match,
              //   // ", winning:",
              //   // winningBetOn,
              //   // winningOdd,
              //   // ", selected:",
              //   // this.selectedBetType,
              //   ", betRound:",
              //   this.betRound,
              //   ", bet:",
              //   this.bet,
              //   ", bank:",
              //   this.bank,
              //   ", debt:",
              //   this.martingaleCurrentDebt,
              //   ", round:",
              //   this.martingaleCurrentBetRound
              // );
            } else if (this.betOnRosters["1"]) {
              this.bet.push(
                this.setMartingaleBets(adjustedOdd1, moneyPerMatch, "1")
              );

              if (!match["1-bool"]) {
                this.bank -= this.sumArray(this.bet);
                this.martingaleCurrentDebt += this.sumArray(this.bet);
                this.martingaleCurrentBetRound++;
              } else {
                this.bank +=
                  this.keepLastItemArray(this.bet)[0] * adjustedOdd1 -
                  this.keepLastItemArray(this.bet)[0];
                this.martingaleCurrentDebt = 0;
                this.martingaleCurrentBetRound = 0;

                this.insights.convertedodds.push(adjustedOdd1);
                this.insights.betEventCount++;
              }
            } else if (this.betOnRosters["2"]) {
              this.bet.push(
                this.setMartingaleBets(adjustedOdd2, moneyPerMatch, "2")
              );

              if (!match["2-bool"]) {
                this.bank -= this.sumArray(this.bet);
                this.martingaleCurrentDebt += this.sumArray(this.bet);
                this.martingaleCurrentBetRound++;
              } else {
                this.bank +=
                  this.keepLastItemArray(this.bet)[0] * adjustedOdd2 -
                  this.keepLastItemArray(this.bet)[0];
                this.martingaleCurrentDebt = 0;
                this.martingaleCurrentBetRound = 0;

                this.insights.convertedodds.push(adjustedOdd2);
                this.insights.betEventCount++;
              }
            } else if (this.betOnRosters["x"]) {
              this.bet.push(
                this.setMartingaleBets(adjustedOddX, moneyPerMatch, "x")
              );

              if (!match["x-bool"]) {
                this.bank -= this.sumArray(this.bet);
                this.martingaleCurrentDebt += this.sumArray(this.bet);
                this.martingaleCurrentBetRound++;
              } else {
                this.bank +=
                  this.keepLastItemArray(this.bet)[0] * adjustedOddX -
                  this.keepLastItemArray(this.bet)[0];
                this.martingaleCurrentDebt = 0;
                this.martingaleCurrentBetRound = 0;

                this.insights.convertedodds.push(adjustedOddX);
                this.insights.betEventCount++;
              }
            }

            this.betRound = this.bet;

            // if (this.martingaleEnabled && this.selectedBetType) {
            //   if (
            //     this.martingaleCurrentBetRound > this.martingaleHardStopRound
            //   ) {
            //     // Reset the Martingale system
            //     this.martingaleCurrentDebt = 0;
            //     this.martingaleCurrentBetRound = 0;
            //     this.bet = this.keepLastItemArray(this.bet);
            //     this.betRound = this.bet;
            //   }
            // }
            const sumBet = this.sumArray(this.betRound);
            if (sumBet > this.insights.highestBet) {
              this.insights.highestBet = sumBet;
            }
            if (this.insights.highestBank < this.bank) {
              this.insights.highestBank = this.decimalFormat(this.bank);
            }
            if (this.insights.lowestBank > this.bank) {
              this.insights.lowestBank = this.decimalFormat(this.bank);
            }

            return {
              ...match,
              1: adjustedOdd1,
              2: adjustedOdd2,
              x: adjustedOddX,
              bet: this.betRound,
              bank: this.decimalFormat(this.bank),
              id: id++,
              martingaleCurrentBetRound: this.martingaleCurrentBetRound,
              martingaleDebt: this.decimalFormat(this.martingaleCurrentDebt),
            };
          });
        }
      }

      this.srajtofla = this.decimalFormat(this.bank) + " EUR";
      this.insights.convertedodds.sort();
      return newData;
    },
    visibleRosters() {
      return this.rostersDataMapped.slice(
        0,
        this.loadedRosters + this.pageSize
      );
    },
    teamsDataMapped() {
      // this.selectBetType();

      if (isEmptyObject(this.teamsYearDataset)) {
        return {};
      }
      let newData = {};
      let id = 0;
      this.allMatchEventsCount = 0;
      this.bank = 0;
      this.insights.convertedodds = [];
      this.insights.betEventCount = 0;

      for (let i = 0; i < this.selectedTeams.length; i++) {
        this.allMatchEventsCount += this.teamsYearDataset[
          this.selectedTeams[i]
        ].length;

        newData[this.selectedTeams[i]] = this.teamsYearDataset[
          this.selectedTeams[i]
        ].map((match) => {
          const adjustedOdd1 = this.getAdjustedOdd(match["1"]);
          const adjustedOddX = this.getAdjustedOdd(match["x"]);
          const adjustedOdd2 = this.getAdjustedOdd(match["2"]);
          this.betRound = this.bet;

          if (!this.insights.convertedodds) {
            this.insights.convertedodds = [];
          }

          if (
            this.rangeActive &&
            this.oddsRangeFilter.min &&
            this.oddsRangeFilter.max
          ) {
            let winningOdd;
            let winningBetOn;
            this.betRound = 0;

            if (match["x-bool"]) {
              winningOdd = adjustedOddX;
              winningBetOn = "draw";
            } else if (match["1-bool"]) {
              winningOdd = adjustedOdd1;
              if (match.home) {
                winningBetOn = "win";
              } else {
                winningBetOn = "loss";
              }
            } else if (match["2-bool"]) {
              winningOdd = adjustedOdd2;
              if (match.home) {
                winningBetOn = "loss";
              } else {
                winningBetOn = "win";
              }
            }

            const betTypeAndRangeOdds = [];

            if (!this.selectedBetType) {
              betTypeAndRangeOdds.push(
                adjustedOdd1,
                adjustedOddX,
                adjustedOdd2
              );
            } else if (this.selectedBetType === "win") {
              if (match.home) {
                betTypeAndRangeOdds.push(adjustedOdd1);
              } else {
                betTypeAndRangeOdds.push(adjustedOdd2);
              }
            } else if (this.selectedBetType === "draw") {
              betTypeAndRangeOdds.push(adjustedOddX);
            } else if (this.selectedBetType === "loss") {
              if (match.home) {
                betTypeAndRangeOdds.push(adjustedOdd2);
              } else {
                betTypeAndRangeOdds.push(adjustedOdd1);
              }
            }

            betTypeAndRangeOdds.forEach((odd) => {
              // bet applying
              if (this.isOddInRange(odd, this.oddsRangeFilter)) {
                this.bank -= this.bet;
                this.betRound += this.bet;
              }

              // only range yield applied
              if (
                !this.selectedBetType &&
                odd === winningOdd &&
                this.isOddInRange(odd, this.oddsRangeFilter)
              ) {
                this.bank += this.bet * winningOdd;
                this.insights.convertedodds.push(winningOdd);
              }

              if (
                !this.selectedBetType &&
                this.isOddInRange(odd, this.oddsRangeFilter)
              ) {
                this.insights.betEventCount++;
              }
            });
            // yield range + bet type applying
            if (
              winningBetOn === this.selectedBetType &&
              this.isOddInRange(winningOdd, this.oddsRangeFilter)
            ) {
              this.bank += this.betRound * winningOdd;
              this.insights.convertedodds.push(winningOdd);
              this.insights.betEventCount++;
            }
            if (
              !betTypeAndRangeOdds.some((odd) =>
                this.isOddInRange(odd, this.oddsRangeFilter)
              )
            ) {
              this.betRound = 0;
            }

            // console.log(
            //   match.match,
            //   ", winning:",
            //   winningOdd,
            //   winningBetOn,
            //   ", selected:",
            //   betTypeAndRangeOdds,
            //   this.selectedBetType,
            //   ", betRound:",
            //   this.betRound,
            //   ", bank:",
            //   this.bank
            // );
          } else if (this.betOn.win) {
            if (match.home) {
              if (!match["1-bool"]) {
                this.bank -= this.bet;
              } else {
                this.bank += this.bet * adjustedOdd1 - this.bet;
                this.insights.convertedodds.push(adjustedOdd1);
                this.insights.betEventCount++;
              }
            } else {
              if (!match["2-bool"]) {
                this.bank -= this.bet;
              } else {
                this.bank += this.bet * adjustedOdd2 - this.bet;
                this.insights.convertedodds.push(adjustedOdd2);
                this.insights.betEventCount++;
              }
            }
          } else if (this.betOn.loss) {
            if (match.home) {
              if (!match["2-bool"]) {
                this.bank -= this.bet;
              } else {
                this.bank += this.bet * adjustedOdd2 - this.bet;
                this.insights.convertedodds.push(adjustedOdd2);
                this.insights.betEventCount++;
              }
            } else {
              if (!match["1-bool"]) {
                this.bank -= this.bet;
              } else {
                this.bank += this.bet * adjustedOdd1 - this.bet;
                this.insights.convertedodds.push(adjustedOdd1);
                this.insights.betEventCount++;
              }
            }
          } else if (this.betOn.draw) {
            if (!match["x-bool"]) {
              this.bank -= this.bet;
            } else {
              this.bank += this.bet * adjustedOddX - this.bet;
              this.insights.convertedodds.push(adjustedOddX);
              this.insights.betEventCount++;
            }
          }

          return {
            ...match,
            1: adjustedOdd1,
            2: adjustedOdd2,
            x: adjustedOddX,
            bet: this.betRound,
            bank: this.decimalFormat(this.bank),
            id: id++,
          };
        });
      }
      this.srajtofla = this.decimalFormat(this.bank) + " EUR";
      this.insights.convertedodds.sort();
      return newData;
    },
    teamsDataFiltered() {
      // Create a new object to store filtered data
      const filteredData = {};

      for (const [teamName, teamData] of Object.entries(this.teamsDataMapped)) {
        if (
          this.selectedTeams.length === 0 ||
          this.selectedTeams.includes(teamName)
        ) {
          // Filter and add data for the selected team
          const filteredTeamData = teamData.filter((item) => {
            // if (this.selectedProperties.length === 0) return true;
            // if (this.selectedProperties.includes('1')) {
            //   const val1 = parseFloat(item['1']);
            //   if (val1 < this.minValue || val1 > 1.7) return false;
            // }
            // if (this.selectedProperties.includes('2')) {
            //   const val2 = parseFloat(item['2']);
            //   if (val2 < this.minValue || val2 > 1.7) return false;
            // }
            return true;
          });

          if (filteredTeamData.length > 0) {
            filteredData[teamName] = filteredTeamData;
          }
        }
      }
      return filteredData;
    },
  },
  watch: {
    selectedDataset() {
      this.loadDataset();
    },
    betOnActive(active) {
      if (active) {
        this.betOnScoreActive = !active;
      }
    },
    betOnScoreActive(active) {
      if (active) {
        this.betOnActive = !active;
      }
    },
    // betOn: {
    //   handler() {
    //     console.log(this.bet);
    //   },
    //   deep: true,
    // },
    // rostersAllDatasetArray: {
    //   handler() {
    //     this.selectBetType();
    //   },
    //   deep: true,
    // },
    // teamsYearDataset: {
    //   handler() {
    //     this.selectBetType();
    //   },
    //   deep: true,
    // },
  },
  created() {
    this.setBet = this.initMoney;
    this.selectedDataset = listOfDatasets[0];
  },
  mounted() {
    // this.selectedBetOn =
    //   findTrueObjectProperty(
    //     this.rostersAllDatasetArray.length ? this.betOnRosters : this.betOn
    //   );
    this.loadDataset();
    setTimeout(() => {
      this.removeSandboxCta();
    }, 1000);
  },
  methods: {
    isEmptyObject: isEmptyObject,
    decimalFormat(number) {
      return Math.round(number * 100) / 100;
    },
    calculateMartingaleBet(odd, moneyPerMatch) {
      const citatel =
        Number(moneyPerMatch || this.martingaleMoneyPerMatch) +
        this.martingaleCurrentDebt;
      const menovatel = odd - 1;
      // vklad = zisk / (kurz - 1) + dlh
      const result = this.decimalFormat(citatel / menovatel);
      // console.log(result);
      return result;
    },
    sumArray(numbers) {
      const sum = numbers.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      );
      return sum;
    },
    keepLastItemArray(array) {
      if (array.length > 1) {
        return array.splice(0, array.length - 1);
      } else if (array.length === 1) {
        return array;
      }
      return [];
    },
    onTableRosterScroll(event) {
      const container = event.target;
      if (
        container.scrollHeight - container.clientHeight - container.scrollTop <
        200
      ) {
        // Load more rosters when close to the bottom
        this.loadedRosters += this.pageSize;
      }
    },
    selectBetType() {
      this.selectedBetType = "";
      if (this.rostersAllDatasetArray.length) {
        this.selectedBetType = findTrueObjectProperty(this.betOnRosters);
      } else {
        this.selectedBetType = findTrueObjectProperty(this.betOn) || "";
      }
    },
    // computeMappedData(data, isRoster = false) {
    //   // Shared logic for computing mapped data
    //   const mappedData = data.map((match) => {
    //     const adjustedOdd1 = this.getAdjustedOdd(match["1"]);
    //     const adjustedOddX = this.getAdjustedOdd(match["x"]);
    //     const adjustedOdd2 = this.getAdjustedOdd(match["2"]);
    //     this.betRound = this.bet;

    //     // Check if the Martingale system is enabled
    //     if (this.martingaleEnabled) {
    //       // Calculate the bet amount based on the current round
    //       const martingaleBet =
    //         this.bet * Math.pow(this.martingaleIncrease, this.currentBetRound);

    //       // Apply the Martingale bet
    //       this.betRound = martingaleBet;
    //     }
    //     // ... Your existing logic for computing bank, insights, etc.

    //     return {
    //       ...match,
    //       1: adjustedOdd1,
    //       2: adjustedOdd2,
    //       x: adjustedOddX,
    //       bet: this.betRound,
    //       bank: this.decimalFormat(this.bank),
    //     };
    //   });

    //   return mappedData;
    // },
    async loadDataset() {
      if (this.selectedDataset) {
        try {
          // Use dynamic import to load the JSON file
          const dataset = await import(
            `./assets/data/${this.selectedDataset}.json`
          );

          if (Array.isArray(dataset.default)) {
            // Handle the case where it's an array
            if (this.selectedDataset.includes("roster")) {
              this.rostersAllDatasetArray = dataset.default;
              this.teamsYearDataset = {};
              this.resetStates();
            }
          } else if (typeof dataset === "object") {
            // Handle the case where it's an object
            this.teamsYearDataset = dataset;
            this.rostersAllDatasetArray.splice(
              0,
              this.rostersAllDatasetArray.length
            );
            this.resetStates();
          } else {
            console.log("Unsupported JSON data type.");
          }
        } catch (error) {
          console.error("Failed to load JSON data:", error);
        }
      }
    },
    removeSandboxCta(count = 0) {
      if (this.sandboxCtaHidden || count > 50) {
        return true;
      }
      const iframe = document.querySelector("iframe");
      if (iframe) {
        this.sandboxCtaHidden = true;

        const div = document.createElement("div");
        div.style.display = "none";

        iframe.parentNode.insertBefore(div, iframe);
        div.appendChild(iframe);
      } else {
        this.$nextTick(() => {
          // this.removeSandboxCta(count++);
        });
      }
    },
    resetStates() {
      this.bank = 0;
      this.srajtofla = "0 EUR";
      this.allMatchEventsCount = 0;
      this.countRoasterYears = 0;
      this.$set(this.insights, "convertedodds", []);
    },
    handleResetBets() {
      // Reset
      this.martingaleCurrentDebt = 0;
      this.martingaleCurrentBetRound = 1;
      // this.betRound = this.bet;
      this.bet = this.keepLastItemArray(this.bet);
      this.betRound = this.bet;
    },
    open() {
      this.$refs.bottomSheet.open();
    },
    close() {
      this.$refs.bottomSheet.close();
    },
    handleBetOnType(type) {
      this.setBetOn(type);
      this.selectedBetType = type;
    },
    handleScoreType(type) {
      this.setScore(type);
      this.selectedScoreType = type;
    },
    setScore(type) {
      this.$nextTick(() => {
        this.betOnScore = {
          "<8": false,
          "<6.5": false,
          "<7.5": false,
          "<7": false,
          "<6": false,
          ">6": false,
          ">6.5": false,
          ">7": false,
          ">7.5": false,
          ">8": false,
        };
        this.betOnScore[type] = true;
      });

      // trigger main computed DataMapped
      this.bank = 0;
    },
    setBetOn(type) {
      this.$nextTick(() => {
        this.betOnRosters = {
          1: false,
          x: false,
          2: false,
        };
        this.betOn = {
          win: false,
          draw: false,
          loss: false,
        };
        if (Object.keys(this.betOnRosters).includes(type)) {
          this.betOnRosters[type] = true;
        } else if (Object.keys(this.betOn).includes(type)) {
          this.betOn[type] = true;
        }
      });

      // trigger main computed DataMapped
      this.bank = 0;
    },

    setInsight(key, value) {
      this.insights[key] = value;
    },
    setSelectedTeams(newSelectedTeams) {
      this.selectedTeams = newSelectedTeams;
    },
    setSelectedDataset(newSelectedData) {
      this.selectedDataset = newSelectedData;
    },
    getAdjustedOdd(odd) {
      return this.decimalFormat(odd * this.oddsPercentageAdjustment);
    },
    generateKey(item) {
      // You can generate a unique key here based on your requirements
      return Math.random().toString(36).substr(2, 9);
    },
    setMartingaleBets(odd, moneyPerMatch, path) {
      if (this.martingaleEnabled) {
        // console.log(path);
        return this.calculateMartingaleBet(odd, moneyPerMatch);
      }
    },
  },
};
</script>

<style lang="scss">
body {
  /* background-color: rgba(128, 128, 128, 0.06); */
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

body,
p,
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
}

th {
  position: sticky;
  top: 0;
  background-color: #eaeaea;
}

[v-cloak] {
  display: none;
}

#app {
  display: flex;
  justify-content: center;
}
input {
  width: 35px;
}
/* .teams-wrapper {
  flex-direction: column;
  align-items: flex-start;
} */
.tables {
  padding-top: 70px;
  font-size: 14px;
}
.bank {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  padding: 5px;
  width: 100%;
  background: white;
  text-align: left;
  box-shadow: 0 3px 8px rgba(128, 128, 128, 0.11);
  z-index: 10;
}
.spacing {
  margin: 12px;
}
.spacing-top {
  margin-top: 12px;
}
.spacing-left {
  margin-left: 12px;
}
.spacing-right {
  margin-right: 12px;
}
.spacing-left-sm {
  margin-left: 4px;
}
.spacing-right-sm {
  margin-right: 4px;
}
.filter-button {
  position: fixed;
  bottom: 20px;
  right: 16px;
  background-color: black;
  color: white;
  border: 1px solid gray;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  z-index: 10;
}
.d-none {
  display: none;
}
.d-block {
  display: block;
}
.d-inline-block {
  display: inline-block;
}
.d-flex {
  display: flex;
}
.d-inline-flex {
  display: inline-flex;
}
.flex-column {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.flex-wrap {
  flex-wrap: wrap;
}
.text-xxs {
  font-size: 10px;
}
.text-xs {
  font-size: 12px;
}
.text-small {
  font-size: 14px;
}
.text-normal {
  font-size: 16px;
}
.text-xl {
  font-size: 20px;
}
.lh-1 {
  line-height: 1;
}
.lh-small {
  line-height: 1.2;
}
.item-height {
  height: 40px;
}
</style>
