<template>
  <div>
    <v-form ref="form" lazy-validation @submit.prevent="submit">
      <v-card class="">
        <v-card-title class="justify-center display-1 mv-2">Accept Invite</v-card-title>

        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="px-2 mb-2">
              <h3 class="text-left black--text">Basic Information</h3>
            </v-col>
            <v-col cols="12" md="6" class="px-2">
              <v-text-field
                v-model="user.first_name"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="First Name"
                name="first_name"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-2">
              <v-text-field
                v-model="user.last_name"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="Last Name"
                name="last_name"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col v-if="owner" cols="12" md="6" class="px-2">
              <v-text-field
                v-model="user.email"
                :rules="emailRules"
                :validate-on-blur="false"
                :error="error"
                label="Email"
                name="email"
                disabled
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-2">
              <v-text-field
                v-model="user.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                :error="error"
                :error-messages="errorMessages"
                label="Password"
                name="password"
                outlined
                dense
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-2">
              <v-text-field
                v-model="user.phone_number"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="Phone"
                name="phone"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="px-2">
              <v-text-field
                v-model="user.mobile_number"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="Mobile"
                name="mobile"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col v-if="owner" cols="12" class="px-2">
              <v-text-field
                v-model="user.company_name"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="Company"
                name="company"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="px-2 mb-2">
              <h3 class="text-left black--text">Address</h3>
            </v-col>
            <v-col cols="12" class="px-2">
              <v-text-field
                v-model="user.address.street"
                label="Address"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" class="px-2">
              <v-text-field
                v-model="user.address.city"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="City"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" class="px-2">
              <v-autocomplete
                v-model="user.address.state"
                :items="states"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                item-text="name"
                item-value="value"
                label="State"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" lg="4" class="px-2">
              <v-text-field
                v-model="user.address.zip"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                type="number"
                label="Zip"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="mt-3">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="px-2 mb-2">
              <h3 class="text-left black--text">Billing Address</h3>
            </v-col>
            <v-col cols="12" class="px-2">
              <v-checkbox v-model="same_address" label="Same as address" @change="setBillingAddress"></v-checkbox>
            </v-col>
            <v-col cols="12" class="px-2">
              <v-text-field
                v-model="user.billing_address.street"
                label="Address"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" class="px-2">
              <v-text-field
                v-model="user.billing_address.city"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                label="City"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="4" class="px-2">
              <v-autocomplete
                v-model="user.billing_address.state"
                :items="states"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                item-text="name"
                item-value="value"
                label="State"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" lg="4" class="px-2">
              <v-text-field
                v-model="user.billing_address.zip"
                :rules="required"
                :validate-on-blur="false"
                :error="error"
                type="number"
                label="Zip"
                outlined
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-btn
        :loading="saveLoading"
        :disabled="saveLoading"
        block
        large
        color="primary"
        type="submit"
        class="mt-3"
      >
        Accept Invite</v-btn>
    </v-form>
  </div>
</template>

<script>
import states from '@/configs/states.json'
export default {
  props: {
    inviteInfo: {
      type: Object,
      default: null
    },
    owner: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      states,
      same_address: false,
      user: {
        code: null,
        first_name: null,
        last_name: null,
        company_name: null,
        email: null,
        phone_number: null,
        mobile_number: null,
        password: null,
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
      saveLoading: false,
      // form
      isFormValid: true,
      error: false,
      errorMessages: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => !!v && v.length >= 8 || 'Password should contain minimum 8 characters.'
      ],
      required: [(v) => !!v || 'Required'],
      showPassword: false
    }
  },

  watch: {
    inviteInfo(val) {
      if (val) {
        this.setDetails()
      }
    }
  },
  created() {
    if (this.inviteInfo) {
      this.setDetails()
    }
  },

  methods: {
    setDetails() {
      for (const key in this.user) {
        const value = this.inviteInfo[key]

        if (value) {
          this.user[key] = this.inviteInfo[key]
        }
      }
    },
    setBillingAddress(value) {
      if (value) {
        this.user.billing_address = Object.assign({}, this.user.address)
      } else {
        this.user.billing_address = {
          street: null,
          city: null,
          state: null,
          zip: null
        }
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.user.code = this.$route.params.id
        this.saveLoading = true
        if (this.owner) {
          this.customerAccept()
        } else {
          this.customerUserAccept()
        }
      }
    },

    async customerAccept() {
      await this.$store.dispatch('user/acceptCustomerInvite', this.user).then(() => {
        const login = {
          email: this.user.email,
          password: this.user.password
        }

        this.$store.dispatch('auth/loginUser', login).then(async (user) => {
          await this.$store.dispatch('auth/getUser')
          this.redirectUser(user.data)
          this.saveLoading = false
        }).catch(() => {
          this.saveLoading = false
        })
      }).catch(() => {
        this.saveLoading = false
      })
    },

    async customerUserAccept() {
      const payload = { ...this.user }

      payload.id = this.inviteInfo.invite_id
      delete payload.company_name
      delete payload.email

      await this.$store.dispatch('user/acceptInviteForCustomerUser', payload).then((resp) => {
        const login = {
          email: resp.email,
          password: this.user.password
        }

        this.$store.dispatch('auth/loginUser', login).then(async (user) => {
          await this.$store.dispatch('auth/getUser')
          this.redirectUser(user.data)
          this.saveLoading = false
        }).catch(() => {
          this.saveLoading = false
        })
      }).catch(() => {
        this.saveLoading = false
      })
    }
  }
}
</script>
