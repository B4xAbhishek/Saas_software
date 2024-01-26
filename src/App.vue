<template>
  <v-app>
    <!-- Layout component -->
    <component :is="currentLayout" v-if="isRouterLoaded">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </component>

    <!-- <v-snackbar v-model="toast.show" :timeout="toast.timeout" :color="toast.color" bottom>
      {{ toast.message }}
      <v-btn v-if="toast.timeout === 0" color="white" text @click="toast.show = false">{{ $t('common.close') }}</v-btn>
    </v-snackbar> -->

    <v-snackbar
      v-if="toast"
      v-model="toast.show"
      :color="toast.color"
      :right="true"
      :top="true"
    >
      {{ toast.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="toast.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Demo customization menu -->
    <customization-menu />
  </v-app>
</template>

<script>
import { mapState, mapGetters  } from 'vuex'

// Demo Menu
import CustomizationMenu from './components/demo/CustomizationMenu'

import config from './configs'

// Layouts
import defaultLayout from './layouts/DefaultLayout'
import landingLayout from './layouts/LandingLayout'
import simpleLayout from './layouts/SimpleLayout'
import authLayout from './layouts/AuthLayout'
import errorLayout from './layouts/ErrorLayout'
// import axios from 'axios'

/*
|---------------------------------------------------------------------
| Main Application Component
|---------------------------------------------------------------------
|
| In charge of choosing the layout according to the router metadata
|
*/
export default {
  components: {
    CustomizationMenu,
    defaultLayout,
    landingLayout,
    simpleLayout,
    authLayout,
    errorLayout
  },
  data: () => ({
    toast: null
  }),
  computed: {
    // ...mapState('app', ['toast']),
    ...mapGetters(['getToast']),
    isRouterLoaded: function() {
      if (this.$route.name !== null) return true

      return false
    },
    currentLayout: function() {
      const layout = this.$route.meta.layout || 'default'

      return layout + 'Layout'
    }
  },
  watch: {
    getToast(val) {
      if (val) {
        this.toast = val
      }
    },
    isRouterLoaded(val) {
      if (val) {
        this.refresh()
      }
    }
  },
  methods: {
    async refresh() {
      if (this.getLoggedUser()) {
        if (this.$route.name !== 'accept-invite' && this.$route.name !== 'owner-invite') {
          await this.$store.dispatch('auth/refreshToken').then(() => {
            if (!this.$store.state.auth.user) {
              console.log('GET USER')
              this.$store.dispatch('auth/getUser')
            }
          }).catch(() => {
            this.logoutUser()
          })
        }
      }
    }
  },
  head: {
    link: [
      // adds config/icons into the html head tag
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  }
}
</script>

<style>
/**
 * Transition animation between pages
 */
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.ag-theme-alpine {
    --ag-header-height: 50px !important;
    --ag-header-foreground-color: white !important;
    --ag-header-background-color: white !important;
    --ag-header-cell-hover-background-color: white !important;
    --ag-header-cell-moving-background-color: white !important;
    --ag-borders: none !important;
}

.ag-theme-alpine .ag-row-class:hover {
  transition: box-shadow 0.2s, transform 0.2s !important;
}

.e-toolbar-wrapper {
  min-height: 50px !important;
}

p {
  margin: 0 !important;
  padding: 0 !important;
}

/* .location-stage-chips span.v-chip.v-size--small {
  font-size: 9px !important;
  height: 18px !important;
  padding: 0px !important;
} */
</style>
