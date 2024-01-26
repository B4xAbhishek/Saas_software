import Vue from 'vue'
import App from './App.vue'

// VUEX - https://vuex.vuejs.org/
import store from './store'

// VUE-ROUTER - https://router.vuejs.org/
import router from './router'
// import axios from './Repository/Repository'

// PLUGINS
import vuetify from './plugins/vuetify'
import i18n from './plugins/vue-i18n'
import './plugins/vue-google-maps'
import './plugins/vue-shortkey'
import './plugins/vue-head'
import './plugins/vue-gtag'
import './plugins/apexcharts'
import './plugins/echarts'
import './plugins/animate'
import './plugins/clipboard'
import './plugins/moment'

// FILTERS
import './filters/capitalize'
import './filters/lowercase'
import './filters/uppercase'
import './filters/formatCurrency'
import './filters/formatDate'

// STYLES
// Main Theme SCSS
import './assets/scss/theme.scss'

// Animation library - https://animate.style/
import 'animate.css/animate.min.css'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import BreadCrumb from '@/components/common/BreadCrumb'
Vue.component('bread-crumbs', BreadCrumb)

import VueQRCodeComponent from 'vue-qrcode-component'
Vue.component('qr-code', VueQRCodeComponent)

import { registerLicense } from '@syncfusion/ej2-base'

const key = process.env.VUE_APP_SYNCFUSION_KEY_PROD + '='

registerLicense(key)

import { GanttPlugin } from '@syncfusion/ej2-vue-gantt'
import { DialogPlugin } from '@syncfusion/ej2-vue-popups'
import { RichTextEditorPlugin } from '@syncfusion/ej2-vue-richtexteditor'
import { KanbanPlugin } from '@syncfusion/ej2-vue-kanban'

import './assets/syncfusion/gantt/material.css'
import './assets/syncfusion/base/material.css'
import './assets/syncfusion/buttons/material.css'
import './assets/syncfusion/calendars/material.css'
import './assets/syncfusion/dropdowns/material.css'
import './assets/syncfusion/inputs/material.css'
import './assets/syncfusion/navigations/material.css'
import './assets/syncfusion/popups/material.css'
import './assets/syncfusion/lists/material.css'
import './assets/syncfusion/layouts/material.css'
import './assets/syncfusion/splitbuttons/material.css'
import './assets/syncfusion/grids/material.css'
import './assets/syncfusion/treegrid/material.css'
import './assets/syncfusion/richtexteditor/material.css'
import './assets/syncfusion/kanban/material.css'

// import '@syncfusion/ej2-vue-richtexteditor/styles/material.css'

// import '@syncfusion/ej2-gantt/styles/material.css'
// import '@syncfusion/ej2-base/styles/material.css'
// import '@syncfusion/ej2-buttons/styles/material.css'
// import '@syncfusion/ej2-calendars/styles/material.css'
// import '@syncfusion/ej2-dropdowns/styles/material.css'
// import '@syncfusion/ej2-inputs/styles/material.css'
// import '@syncfusion/ej2-navigations/styles/material.css'
// import '@syncfusion/ej2-popups/styles/material.css'
// import '@syncfusion/ej2-lists/styles/material.css'
// import '@syncfusion/ej2-layouts/styles/material.css'
// import '@syncfusion/ej2-splitbuttons/styles/material.css'
// import '@syncfusion/ej2-grids/styles/material.css'
// import '@syncfusion/ej2-richtexteditor/styles/material.css'
// import '@syncfusion/ej2-treegrid/styles/material.css'
// import '@syncfusion/ej2-vue-kanban/styles/material.css'

Vue.use(GanttPlugin)
Vue.use(DialogPlugin)
Vue.use(RichTextEditorPlugin)
Vue.use(KanbanPlugin)

import globalMixin from '../src/mixins/global'
Vue.mixin(globalMixin)

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

import setupInterceptors from '@/Repository/Interceptor'
setupInterceptors(store)

/*
|---------------------------------------------------------------------
| Main Vue Instance
|---------------------------------------------------------------------
|
| Render the vue application on the <div id="app"></div> in index.html
|
| https://vuejs.org/v2/guide/instance.html
|
*/
export default new Vue({
  i18n,
  vuetify,
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
