<template>
  <div>
    <v-dialog v-model="open" persistent max-width="600">
      <v-card>
        <v-form ref="form" @submit.prevent="send">
          <v-card-text>
            <div class="d-flex justify-space-between align-center pb-2">
              <h2>Invite Customer</h2>
              <v-icon @click="$emit('close')">mdi-close</v-icon>
            </div>
            <v-divider></v-divider>

            <v-row no-gutters class="account-details-form mt-3">
              <v-col cols="12" class="px-1">
                <v-text-field
                  v-model="user.email"
                  :validate-on-blur="false"
                  :rules="emailRules"
                  label="Email"
                  name="email"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="px-1 mb-3">
                <v-btn color="primary" small text @click="showMore = !showMore">
                  <v-icon>{{ showMore ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  <span class="primary--text">{{ showMore ? 'Hide' : 'More Details'
                  }}</span>
                </v-btn>
              </v-col>
              <template v-if="showMore">
                <v-col cols="12" md="6" class="px-1">
                  <v-text-field
                    v-model="user.first_name"
                    :validate-on-blur="false"
                    label="First Name"
                    name="first_name"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="px-1">
                  <v-text-field
                    v-model="user.last_name"
                    :validate-on-blur="false"
                    label="Last Name"
                    name="last_name"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="px-1">
                  <v-text-field
                    v-model="user.phone_number"
                    :validate-on-blur="false"
                    label="Phone"
                    name="phone"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="px-1">
                  <v-text-field
                    v-model="user.mobile_number"
                    :validate-on-blur="false"
                    label="Mobile"
                    name="mobile"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="px-1">
                  <v-text-field
                    v-model="user.company_name"
                    :validate-on-blur="false"
                    label="Company"
                    name="company"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="px-1">
                  <v-text-field
                    v-model="user.address.street"
                    label="Address"
                    :rules="required"
                    :validate-on-blur="false"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" class="px-1">
                  <v-text-field
                    v-model="user.address.city"
                    :validate-on-blur="false"
                    label="City"
                    :rules="required"
                    outlined
                    dense
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="4" class="px-1">
                  <v-autocomplete
                    v-model="user.address.state"
                    :items="states"
                    :validate-on-blur="false"
                    item-text="name"
                    item-value="value"
                    label="State"
                    :rules="required"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" lg="4" class="px-1">
                  <v-text-field
                    v-model="user.address.zip"
                    :validate-on-blur="false"
                    type="number"
                    label="Zip"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="px-1">
                  <v-checkbox v-model="same_address" label="Same as address" @change="setBillingAddress"></v-checkbox>
                </v-col>
                <v-col cols="12" class="px-1">
                  <v-text-field
                    v-model="user.billing_address.street"
                    label="Address"
                    :validate-on-blur="false"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" class="px-1">
                  <v-text-field
                    v-model="user.billing_address.city"
                    :validate-on-blur="false"
                    label="City"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" class="px-1">
                  <v-autocomplete
                    v-model="user.billing_address.state"
                    :items="states"
                    :validate-on-blur="false"
                    item-text="name"
                    item-value="value"
                    label="State"
                    :rules="required"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" lg="4" class="px-1">
                  <v-text-field
                    v-model="user.billing_address.zip"
                    :validate-on-blur="false"
                    type="number"
                    label="Zip"
                    :rules="required"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </template>
            </v-row>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn class="primary white--text" :disabled="loading || !user.email" :loading="loading" type="submit">
              Invite <v-icon class="pl-1" color="white">mdi-email</v-icon>
            </v-btn>
            <!-- <v-btn text color="primary" @click="$emit('close')">Close</v-btn> -->
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
import states from '@/configs/states.json'
export default {
  name: 'InviteAccountUser',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      states,
      same_address: false,
      showMore: false,
      loading: false,
      email: null,
      required: [(v) => !!v || 'Required'],
      emailRules: [
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      user: {
        first_name: null,
        last_name: null,
        company_name: null,
        email: null,
        phone_number: null,
        mobile_number: null,
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
      }
    }
  },

  methods: {
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
    async send() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const payload = {
          ...this.user
        }

        await this.$store.dispatch(
          'customer/newAccount',
          payload
        )

        this.email = null
        this.loading = false
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.account-details-form {
  height: auto;
  max-height: 400px;
  overflow-y: auto;
}
</style>