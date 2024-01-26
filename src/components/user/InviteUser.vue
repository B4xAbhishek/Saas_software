<template>
  <div>
    <v-dialog v-model="open" persistent max-width="800">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pt-2 pb-2">
            <h2>Invite Users</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-form class="mt-3" @submit.prevent>
            <v-combobox
              v-model="selectedUsers"
              label="Email Addresses"
              item-text="email"
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
            <v-autocomplete
              v-model="access"
              outlined
              :items="roleList"
              item-text="name"
              item-value="id"
              label="Roles"
              dense
              multiple
              small-chips
              deletable-chips
              placeholder="Select Roles"
            ></v-autocomplete>
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
            :disabled="loading || !selectedUsers.length"
            :loading="loading"
            @click="send"
          >
            Invite <v-icon class="pl-1" color="white">mdi-email</v-icon></v-btn>
          <!-- <v-btn text color="primary" @click="$emit('close')">Close</v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
/* eslint-disable no-useless-escape */
export default {
  name: 'InviteUser',
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
      selectedUsers: [],
      access: [],
      emailRules: [
        (v) => /^[a-zA-Z0-9]+([\w\.\'\!\#\$\%\&\*\+\-\/\=\?\^\`\{\|\}\~])*([a-zA-Z0-9])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  created() {
    this.getRoles()
  },
  computed: {
    ...mapState({
      roleList: (store) => store.auth.roles
    })
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
    }
  },

  methods: {
    getRoles() {
      this.$store.dispatch('auth/getCustomerUserRoles')
    },
    remove(email) {
      this.selectedUsers = this.selectedUsers.filter((user) => user !== email)
    },
    async send() {
      this.loading = true
      if (this.selectedUsers && this.selectedUsers.length) {
        let total = this.selectedUsers.length

        for await (const user of this.selectedUsers) {
          const payload = {
            email: user,
            roles: this.access
          }

          await this.$store.dispatch(
            'user/inviteCustomerUser',
            payload
          )

          total--

          if (total === 0) {
            this.$emit('close')
          }
        }
      }
      this.loading = false
    }
  }
}
</script>
