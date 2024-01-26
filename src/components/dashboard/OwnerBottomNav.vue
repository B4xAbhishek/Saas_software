<template>
  <div>
    <v-bottom-navigation
      v-model="nav"
      color="primary"
      grow
      fixed
    >
      <v-btn to="/projects">
        <span>Projects</span>

        <v-icon>mdi-home-city</v-icon>
      </v-btn>

      <v-btn to="/trade-scheduler">
        <span>Trade Scheduler</span>

        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>

      <v-btn @click="adminMenu = !adminMenu">
        <span>Admin</span>

        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <!-- Admin Menus -->
    <v-dialog
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="adminMenu"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar>
          <v-icon color="primary" @click="adminMenu = false">mdi-chevron-left</v-icon>
          <v-toolbar-title class="primary--text pl-2">Admin</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-list class="mt-2">
            <v-list-item @click="move('/admin/projects')">
              <v-list-item-icon>
                <v-icon>mdi-home-city</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span>Projects</span>
              </v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="move('/admin/cameras')">
              <v-list-item-icon>
                <v-icon>mdi-camera</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span>Cameras</span>
              </v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="move('/admin/camera/setup')">
              <v-list-item-icon>
                <v-icon>mdi-video</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span>Camera Setup</span>
              </v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="move('/admin/users')">
              <v-list-item-icon>
                <v-icon>mdi-account-group</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                <span>Users</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: 0,
      adminMenu: false
    }
  },
  methods: {
    move(path) {
      this.adminMenu = false
      this.moveTo(path)
    }
  }
}
</script>