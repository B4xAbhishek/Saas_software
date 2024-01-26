<template>
  <div class="d-flex flex-column flex-grow-1">
    <div>
      <!-- <v-card v-if="user.disabled" class="warning mb-4" light>
        <v-card-title>User Disabled</v-card-title>
        <v-card-subtitle>This user has been disabled! Login accesss has been revoked.</v-card-subtitle>
        <v-card-text>
          <v-btn dark @click="user.disabled = false">
            <v-icon left small>mdi-account-check</v-icon>Enable User
          </v-btn>
        </v-card-text>
      </v-card> -->
      <div>
        <div class="display-1">Edit Customer</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>

      <template v-if="isLoading">
        <div class="text-center mt-4">
          <v-progress-circular
            :value="100"
            indeterminate
            color="primary"
          ></v-progress-circular>
          <h4>Loading Customer Details...</h4>
        </div>
      </template>
      <template v-else-if="!isLoading && !userInfo.email">
        <div class="text-center mt-4">
          <h4>Customer not found...</h4>
        </div>
      </template>

      <v-form v-if="!isLoading && userInfo.email" ref="form" lazy-validation @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="8" lg="6" xl="5">
            <v-card>
              <v-card-title>Basic Information</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column flex-sm-row">
                  <div class="flex-grow-1 pt-2 pa-sm-2">
                    <v-text-field
                      v-model="userInfo.first_name"
                      label="First Name"
                      placeholder="First Name"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.last_name"
                      label="Last Name"
                      placeholder="Last Name"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.email"
                      type="email"
                      label="Email"
                      disabled
                      :rules="emailRules"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.company_name"
                      label="Company"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.phone_number"
                      label="Phone"
                    ></v-text-field>
                    <v-text-field
                      v-model="userInfo.mobile_number"
                      label="Mobile"
                    ></v-text-field>
                  </div>
                </div>
              </v-card-text>
            </v-card>
            <v-card class="mt-3">
              <v-card-title>Actions</v-card-title>
              <v-card-text>
                <v-select
                  v-model="userInfo.is_suspended"
                  label="Customer Status"
                  :items="[{ name: 'Enabled', value: false }, { name: 'Disabled', value: true }]"
                  item-text="name"
                  item-value="value"
                ></v-select>
              </v-card-text>
            </v-card>
            <v-card class="mt-3">
              <v-card-title>Address</v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="userInfo.address.street"
                  label="Address"
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.address.city"
                  label="City"
                ></v-text-field>
                <v-autocomplete
                  v-model="userInfo.address.state"
                  :items="states"
                  label="State"
                  item-text="name"
                  item-value="value"
                ></v-autocomplete>
                <v-text-field
                  v-model="userInfo.address.zip"
                  type="number"
                  label="Zip"
                ></v-text-field>
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
                ></v-text-field>
                <v-text-field
                  v-model="userInfo.billing_address.city"
                  label="City"
                ></v-text-field>
                <v-autocomplete
                  v-model="userInfo.billing_address.state"
                  :items="states"
                  label="State"
                  item-text="name"
                  item-value="value"
                ></v-autocomplete>
                <v-text-field
                  v-model="userInfo.billing_address.zip"
                  type="number"
                  label="Zip"
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="mt-2">
          <v-btn color="primary" type="submit" :loading="editLoading">Save Changes</v-btn>
          <v-btn color="grey lighten-3" class="ml-2" :disabled="editLoading" @click="$router.push('/customers')">Cancel</v-btn>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import states from '@/configs/states.json'
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      emailRules: [
        (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      isLoading: false,
      editLoading: false,
      userInfo: {
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        mobile_number: null,
        password: null,
        company_name: null,
        is_suspended: false,
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
      confirm_password: null,
      same_address: false,
      panel: [1],
      deleteDialog: false,
      disableDialog: false,
      states,
      breadcrumbs: [{
        text: 'Customers',
        disabled: false,
        to: '/customers'
      }, {
        text: 'Edit Customer',
        disabled: true
      }]
    }
  },
  watch: {
    user: {
      deep: true,
      handler(val) {
        // this.userInfo = JSON.parse(JSON.stringify(val))
      }
    }
  },
  created() {
    this.loadCustomer()
    // if (this.user) {
    //   this.userInfo = JSON.parse(JSON.stringify(this.user))
    // }
  },
  methods: {
    loadCustomer() {
      this.isLoading = true
      this.$store.dispatch('customer/getAccount', this.$route.params.id).then((resp) => {
        this.userInfo = { ...resp }
        this.isLoading = false
      }).finally(() => {
        this.isLoading = false
      })
    },
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
    async save() {
      this.editLoading = true
      await this.$store.dispatch('customer/editAccount', this.userInfo)
      this.editLoading = false
    }
  }
}
</script>
