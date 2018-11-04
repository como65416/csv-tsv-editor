import Vue from 'vue';
import App from './src/App.vue';
import "./node_modules/handsontable/dist/handsontable.full.css";

new Vue({
  render: h => h(App)
}).$mount('#app')