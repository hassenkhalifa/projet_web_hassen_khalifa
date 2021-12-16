import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import 'leaflet/dist/leaflet.css';
import VueRouter from 'vue-router'
import Routes from './router/routes.js'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);


Vue.use(VueMaterial)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: Routes,
  mode: 'history'
})


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
