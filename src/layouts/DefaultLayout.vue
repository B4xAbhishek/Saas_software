<template>
  <div
    v-shortkey="['ctrl', '/']"
    class="d-flex flex-grow-1"
    @shortkey="onKeyup"
  >
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      width="200"
      app
      floating
      class="elevation-1"
      :right="$vuetify.rtl"
      :light="menuTheme === 'light'"
      :dark="menuTheme === 'dark'"
    >
      <!-- Navigation menu info -->
      <template v-slot:prepend>
        <div class="pa-2">
          <div class="title font-weight-bold text-uppercase primary--text">
            <img class="w-full" src="@/assets/images/TeoSite_logo.svg" />
          </div>
          <div class="overline grey--text">{{ product.version }}</div>
        </div>
      </template>

      <v-list-item class="px-2">
        <v-list-item-avatar color="primary" size="36">
          <v-icon color="white">mdi-account</v-icon>
          <!-- <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img> -->
        </v-list-item-avatar>

        <v-list-item-title>
          <template v-if="user && user.first_name">
            <span class="text-truncate">
              {{ user && user.first_name }} {{ user && user.last_name }}
            </span>
          </template>
          <template v-else>
            <span class="text-truncate">
              {{ user && user.email }}
            </span>
          </template>
        </v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />

      <!-- Navigation menu footer -->
      <template v-slot:append>
        <!-- Footer navigation links -->
        <div class="pa-1 text-center">
          <v-btn
            v-for="(item, index) in navigation.footer"
            :key="index"
            :href="item.href"
            :target="item.target"
            small
            text
          >
            {{ item.key ? $t(item.key) : item.text }}
          </v-btn>
        </div>

        <!-- REMOVE ME - Shop Demo purposes -->
        <!-- <div class="pa-2 pt-1 text-center">
          <v-btn
            class="buy-button"
            dark
            block
            color="#EE44AA"
            href="https://store.vuetifyjs.com/products/lux-admin-pro/"
            target="_blank"
          >
            Buy Now
          </v-btn>
        </div> -->
      </template>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'surface' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
        <div class="d-flex flex-grow-1 align-center">

          <!-- search input mobile -->
          <!-- <v-text-field
            v-if="showSearch"
            append-icon="mdi-close"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            hide-details
            solo
            flat
            autofocus
            @click:append="showSearch = false"
          ></v-text-field> -->

          <div class="d-flex flex-grow-1 align-center">
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <v-spacer class="d-none d-lg-block"></v-spacer>

            <!-- search input desktop -->
            <!-- <v-text-field
              ref="search"
              class="mx-1 hidden-xs-only"
              :placeholder="$t('menu.search')"
              prepend-inner-icon="mdi-magnify"
              hide-details
              filled
              rounded
              dense
            ></v-text-field> -->

            <v-spacer class="d-block"></v-spacer>

            <!-- <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn> -->

            <!-- <toolbar-language /> -->

            <!-- <div class="hidden-xs-only mx-1">
              <toolbar-currency />
            </div> -->

            <!-- <toolbar-apps /> -->

            <!-- <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
              <toolbar-notifications />
            </div> -->

            <toolbar-user />
          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container class="" :fluid="!isContentBoxed">
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>

      <!-- Bottom nav -->
      <template v-if="$vuetify.breakpoint.smAndDown">
        <OwnerBottomNav v-if="user && user.type === ROLES.CUSTOMER" />
      </template>

      <!-- <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline">
          Built with <v-icon small color="pink">mdi-heart</v-icon> <a class="text-decoration-none" href="https://indielayer.com" target="_blank">@indielayer</a>
        </div>
      </v-footer> -->
    </v-main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
import OwnerBottomNav from '@/components/dashboard/OwnerBottomNav'
import { ROLES } from '../utils/constants'
// import ToolbarApps from '../components/toolbar/ToolbarApps'
// import ToolbarLanguage from '../components/toolbar/ToolbarLanguage'
// import ToolbarCurrency from '../components/toolbar/ToolbarCurrency'
// import ToolbarNotifications from '../components/toolbar/ToolbarNotifications'

export default {
  components: {
    MainMenu,
    ToolbarUser,
    OwnerBottomNav
    // ToolbarApps
    // ToolbarLanguage,
    // ToolbarCurrency,
    // ToolbarNotifications
  },
  data() {
    return {
      drawer: null,
      showSearch: false,
      mini: false,
      nav: null,
      navigation: config.navigation,
      ROLES
    }
  },
  computed: {
    ...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached'], 'auth', ['user']),
    ...mapState({
      user: (store) => store.auth.user
    })
  },
  methods: {
    onKeyup(e) {
      this.$refs.search.focus()
    }
  }
}
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
</style>
