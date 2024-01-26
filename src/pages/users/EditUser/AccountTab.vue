<template>
  <div class="">
    <div>
      <template v-if="loading">
        <div class="text-center mt-4">
          <v-progress-circular
            :value="100"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <h4>Loading User Profile...</h4>
        </div>
      </template>
      <template v-else-if="!loading && !userInfo.email">
        <div class="text-center mt-4">
          <h4>User not found...</h4>
        </div>
      </template>

      <template v-if="userInfo.email && !loading">
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col cols="12" md="6" xl="5">
              <v-card>
                <v-card-title>Basic Information</v-card-title>
                <v-card-text>
                  <div class="d-flex flex-column flex-sm-row">
                    <!-- <div class="text-center">
                <v-img
                :src="userInfo.avatar"
                aspect-ratio="1"
                class="blue-grey lighten-4 rounded elevation-3"
                max-width="90"
                max-height="90"
              ></v-img>
                <v-avatar color="primary" size="90">
                  <span class="white--text text-h5">JS</span>
                </v-avatar> <br>
                <v-btn class="mt-1" small>Edit Avatar</v-btn>
              </div> -->
                    <div class="flex-grow-1 pt-2 pa-sm-2">
                      <v-text-field
                        v-model="userInfo.first_name"
                        label="First Name"
                        placeholder="First Name"
                        :rules="required"
                      ></v-text-field>
                      <v-text-field
                        v-model="userInfo.last_name"
                        label="Last Name"
                        placeholder="Last Name"
                        :rules="required"
                      ></v-text-field>
                      <!-- <v-text-field
                        v-model="userInfo.email"
                        type="email"
                        label="Email"
                        disabled
                        :rules="emailRules"
                      ></v-text-field> -->
                      <v-text-field
                        v-model="userInfo.phone_number"
                        label="Phone"
                        :rules="required"
                      ></v-text-field>
                      <v-text-field
                        v-model="userInfo.mobile_number"
                        label="Mobile"
                        :rules="required"
                      ></v-text-field>
                      <!-- <v-text-field
                        v-model="userInfo.company"
                        label="Company"
                      ></v-text-field> -->
                    </div>
                  </div>
                </v-card-text>
              </v-card>
              <v-card class="mt-3">
                <v-card-title>Address</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="userInfo.address.street"
                    label="Address"
                    :rules="required"
                  ></v-text-field>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="userInfo.address.city"
                        label="City"
                        :rules="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="userInfo.address.state"
                        :items="states"
                        item-text="name"
                        item-value="value"
                        label="State"
                        :rules="required"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="userInfo.address.zip"
                        type="number"
                        label="Zip"
                        :rules="required"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card class="mt-3">
                <v-card-title>Billing Address</v-card-title>
                <v-card-text>
                  <v-checkbox
                    v-model="same_address"
                    label="Same as address"
                    @change="setBillingAddress"
                  ></v-checkbox>

                  <v-text-field
                    v-model="userInfo.billing_address.street"
                    label="Address"
                    :rules="required"
                  ></v-text-field>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="userInfo.billing_address.city"
                        label="City"
                        :rules="required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-autocomplete
                        v-model="userInfo.billing_address.state"
                        :items="states"
                        label="State"
                        item-text="name"
                        item-value="value"
                        :rules="required"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="userInfo.billing_address.zip"
                        type="number"
                        label="Zip"
                        :rules="required"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <div class="mt-3 text-right">
                <v-btn color="primary" :loading="editProfileLoading" type="submit">Save Changes</v-btn>
              </div>
            </v-col>
          </v-row>
        
        </v-form>

        <v-form ref="passwordForm" @submit.prevent>
          <v-row>
            <v-col cols="12" md="6" xl="5">
              <v-card>
                <v-card-title>Update Password</v-card-title>
                <v-card-text>
                  <v-text-field
                    v-model="password.old"
                    type="password"
                    label="Old Password"
                    :rules="required"
                  ></v-text-field>
                  <v-text-field
                    v-model="password.new"
                    :rules="passwordRules"
                    type="password"
                    label="New Password"
                  ></v-text-field>
                  <v-text-field
                    v-model="confirm_password"
                    :rules="confirmRules"
                    type="password"
                    label="Confirm Password"
                  ></v-text-field>
                </v-card-text>
              </v-card>
              <div class="mt-3 text-right">
                <v-btn color="primary" type="submit" :loading="editPassLoading" @click="updatePassword">Update Password</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </template>
    </div>
  </div>
</template>

<script>
import states from '@/configs/states.json'
export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editProfileLoading: false,
      editPassLoading: false,
      required: [(v) => !!v || 'Required'],
      emailRules: [
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          'E-mail must be valid'
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => !!v && v.length >= 8 || 'Password should contain minimum 8 characters.'
      ],
      confirmRules: [
        (v) => !!v || 'Password is required',
        (v) => !!v && v.length >= 8 || 'Password should contain minimum 8 characters.',
        (v) => !!v && this.password.new === this.confirm_password || 'Password Mismatch.'
      ],
      userInfo: {
        first_name: null,
        last_name: null,
        mobile_number: null,
        phone_number: null,
        address: {
          street: null,
          city: null,
          state: null,
          zip: null
        },
        billing_address: {
          street: null,
          city: null,
          state: null,
          zip: null
        }
      },
      password: {
        old: null,
        new: null
      },
      confirm_password: null,
      same_address: false,
      panel: [1],
      deleteDialog: false,
      disableDialog: false,
      states
    }
  },
  watch: {
    user: {
      deep: true,
      handler(val) {
        this.userInfo = JSON.parse(JSON.stringify(val))
      }
    }
  },
  created() {
    if (this.user) {
      this.userInfo = JSON.parse(JSON.stringify(this.user))
    }
  },
  methods: {
    setBillingAddress(value) {
      if (value) {
        this.userInfo.billing_address = Object.assign(
          {},
          this.userInfo.address
        )
      } else {
        this.userInfo.billing_address = {
          street: null,
          city: null,
          state: null,
          zip: null
        }
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        const payload = { ...this.userInfo }

        delete payload.id
        delete payload.email

        this.editProfileLoading = true
        this.$store.dispatch('user/updateUser', payload).then(() => {
          this.editProfileLoading = false
        }).finally(() => {
          this.editProfileLoading = false
        })
      }
    },
    updatePassword() {
      if (this.$refs.passwordForm.validate()) {
        const payload = {
          old_password: this.password.old,
          new_password: this.password.new
        }

        this.editPassLoading = true
        this.$store.dispatch('user/updatePassword', payload).then(() => {
          this.editPassLoading = false
        }).finally(() => {
          this.editPassLoading = false
        })
      }
    }
  }
}
</script>
