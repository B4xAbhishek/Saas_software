<template>
  <div>
    <v-dialog v-model="open" persistent max-width="800">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pt-2 pb-2">
            <h2>Share</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-form class="mt-3" @submit.prevent="send">
            <v-combobox
              v-model="selectedUsers"
              label="Select Users"
              :items="usersList"
              item-text="email"
              item-value="email"
              deletable-chips
              small-chips
              dense
              outlined
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  :key="JSON.stringify(data.item)"
                  small
                  class="px-0"
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  @click:close="data.parent.selectItem(data.item)"
                >
                  <v-avatar
                    class="primary white--text"
                    left
                    v-text="data.item.slice(0, 1).toUpperCase()"
                  ></v-avatar>
                  {{ data.item }}
                  <v-icon class="pl-1" small @click="data.parent.selectItem(data.item)">mdi-close-circle</v-icon>
                </v-chip>
              </template>
            </v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <!-- <span>
            <a @click="send">
              <v-icon class="mr-2">
                mdi-link-variant
              </v-icon>
              Copy link
            </a>
            <v-progress-circular
              v-if="loading"
              :size="20"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </span> -->

          <v-spacer></v-spacer>

          <v-btn
            class="primary white--text"
            :disabled="loading"
            :loading="loading"
            @click="send"
          >
            Share <v-icon class="pl-1" color="white">mdi-email</v-icon></v-btn>
          <v-btn text color="primary" @click="$emit('close')">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="alertCopymsg" hide-overlay persistent width="300">
      <v-card color="success" dark>
        <v-card-title class="justify-center text--normal">
          <i> Link is Copied</i>
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import { mapState } from 'vuex'
export default {
  name: 'Share',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    deviceInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      users: [],
      selectedUsers: [],
      email: '',
      expire: null,
      problem: '',
      description: '',
      problem_types: ['Device Fault', 'Configuration'],
      linkValue: '',
      alertCopymsg: false,
      emailRules: [
        (v) => /^[a-zA-Z0-9]+([\w\.\'\!\#\$\%\&\*\+\-\/\=\?\^\`\{\|\}\~])*([a-zA-Z0-9])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/.test(v) || 'E-mail must be valid'
      ]
    }
  },

  computed: {
    ...mapState({
      subUsers: (store) => store.user.subUsers
    }),
    usersList() {
      if (this.subUsers && this.subUsers.length) {
        return this.subUsers.map((user) => user.email)
      }

      return []
    }
  },

  watch: {
    selectedUsers(val) {
      if (val && val.length) {
        const lastEmail = val[val.length - 1]

        if (/^[a-zA-Z0-9]+([\w\.\'\!\#\$\%\&\*\+\-\/\=\?\^\`\{\|\}\~])*([a-zA-Z0-9])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/.test(lastEmail)) {
          return
        } else {
          this.remove(lastEmail)
        }
      }
    },
    alertCopymsg(val) {
      if (!val) return

      setTimeout(() => (this.alertCopymsg = false), 2000)
    },
    linkValue(val) {
      if (val) {
        const base_url = process.env.VUE_APP_API_URL.replace(
          '/api',
          this.linkValue
        )

        navigator.clipboard.writeText(base_url)
        this.alertCopymsg = true
      }
    }
  },
  created() {
    this.getUsersList()
  },

  methods: {
    remove(email) {
      this.selectedUsers = this.selectedUsers.filter((user) => user !== email)
    },
    async getUsersList() {
      await this.$store.dispatch(
        'user/getCustomerUsers'
      )
    },
    async send() {
      this.loading = true
      if (this.selectedUsers && this.selectedUsers.length) {
        let total = this.selectedUsers.length

        for await (const user of this.selectedUsers) {
          const payload = {
            device_serial_no: this.deviceInfo.SN,
            email: user,
            expire: null
          }
          const data = await this.$store.dispatch(
            'device/createDeviceLink',
            payload
          )

          total -= 1

          if (data && total === 0) {
            this.linkValue = data
            this.$emit('onShare', this.linkValue)
          }
        }
      }
      this.loading = false
    }
  }
}
</script>
