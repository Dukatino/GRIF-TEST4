import Vue from "vue";
import App from "./App.vue";
// import { ObserveVisibility } from "vue-observe-visibility";

Vue.config.productionTip = false;
// Vue.directive("observe-visibility", ObserveVisibility);

new Vue({
  render: (h) => h(App)
}).$mount("#app");
