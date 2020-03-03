import Vue from 'vue';
import App from './App.vue';

import EnoAutoScroll from '../packages';

Vue.use(EnoAutoScroll);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
