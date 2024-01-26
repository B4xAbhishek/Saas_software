<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Edit Plan (subscription)</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <template v-if="isLoading">
      <div class="text-center mt-4">
        <v-progress-circular
          :value="100"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <h4>Loading Plan Details...</h4>
      </div>
    </template>
    <template v-else-if="!isLoading && !planInfo.id">
      <div class="text-center mt-4">
        <h4>Plan not found...</h4>
      </div>
    </template>

    <v-form v-if="planInfo && planInfo.id" ref="form" lazy-validation @submit.prevent="editPlan">

      <v-row no-gutters>
        <v-col cols="12" md="8" lg="6">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <h3 class="black--text mr-2">Status: </h3>
                <v-switch v-model="planInfo.is_active" @change="updateStatus">
                  <template #label>
                    <span v-if="planInfo.is_active" class="success--text">{{ planInfo.is_active && 'Active' }}</span>
                    <span v-else class="red--text">Inactive</span>
                  </template>
                </v-switch>
              </div>
              <v-autocomplete
                v-model="planInfo.customer"
                :rules="required"
                :items="customerList"
                :item-text="(item) => `${item.first_name} ${item.last_name}`"
                item-value="id"
                label="Customer*"
                tabindex="1"
              >
              </v-autocomplete>
              <v-text-field
                v-model="planInfo.name"
                label="Name*"
                :rules="required"
                tabindex="2"
              ></v-text-field>
              <v-text-field
                v-model="planInfo.price"
                :rules="required"
                label="Price*"
                type="number"
                min="1"
                oninput="validity.valid||(value='');"
                tabindex="3"
              ></v-text-field>
              <v-select
                v-model="planInfo.payment_term"
                :rules="required"
                :items="paymentTerms"
                item-text="name"
                item-value="value"
                label="Payment Term*"
                placeholder="Select Payment Term"
                tabindex="4"
              ></v-select>
              <v-text-field
                v-model="planInfo.susbcription_period"
                label="Subscription Days*"
                placeholder="Total dyas the subscription will last from service start"
                type="number"
                min="1"
                :rules="required"
                oninput="validity.valid||(value='');"
                tabindex="5"
              ></v-text-field>
              <v-row no-gutters>
                <v-col cols="6" md="4">
                  <v-text-field
                    label="Bill Every"
                    type="number"
                    min="1"
                    oninput="validity.valid||(value='');"
                    tabindex="6"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="8" class="pl-2">
                  <v-select
                    :items="['day(s)', 'month(s)', 'year(s)']"
                    label="Duration"
                    tabindex="7"
                    disabled
                  ></v-select>
                </v-col>
              </v-row>
              <v-radio-group v-model="radio">
                <v-radio value="1" label="" disabled>
                  <template #label>
                    <v-row no-gutters align="center">
                      <v-col cols="8">
                        Expires after a specified no. of billing cycles
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          v-if="radio == 1"
                          placeholder="1"
                          type="number"
                          min="1"
                          disabled
                          hint="Number of times the customer will be billed for a subscription of this plan."
                          oninput="validity.valid||(value='');"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>
                </v-radio>
                <v-radio disabled value="2" label="Auto-Renews until canceled">
                </v-radio>
              </v-radio-group>
              <v-text-field
                v-model="planInfo.max_idle_after_shipment"
                label="Max days idle after shipping"
                placeholder="10"
                type="number"
                min="1"
                :rules="required"
                oninput="validity.valid||(value='');"
                tabindex="8"
              ></v-text-field>
              <v-text-field
                v-model="planInfo.to_be_returned_after_service_end"
                label="Max days to return the camera"
                hint="Description of the max number of days they can hold the camera after the subscription has expired, otherwise, we will send an invoice for the camera of X dollars"
                placeholder="10"
                type="number"
                min="1"
                :rules="required"
                oninput="validity.valid||(value='');"
                tabindex="9"
              ></v-text-field>
              <v-text-field
                v-model="planInfo.notification_before_service_end"
                label="Notification before service expirations"
                placeholder="days"
                type="number"
                min="1"
                :rules="required"
                oninput="validity.valid||(value='');"
                tabindex="10"
              ></v-text-field>
              <v-autocomplete
                v-model="planInfo.camera_model"
                :rules="required"
                :items="planTypes"
                item-text="name"
                item-value="id"
                label="Plan Type*"
                tabindex="11"
              >
              </v-autocomplete>
              <v-autocomplete
                v-model="planInfo.ownership_type"
                :rules="required"
                :items="owners"
                item-text="name"
                item-value="value"
                label="Camera ownership after service*"
                tabindex="12"
              >
              </v-autocomplete>
              <v-textarea v-model="planInfo.notes" rows="4" label="Notes" tabindex="13"></v-textarea>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn
              color="primary"
              tabindex="14"
              type="submit"
              :loading="editLoading"
            >Save</v-btn>
            <v-btn
              color="gray"
              tabindex="15"
              class="mx-2"
              :disabled="editLoading"
              to="/plans"
            >Cancel</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoading: false,
      editLoading: false,
      radio: '1',
      paymentTerms: [
        { name: 'Postpay', value: 'postpay' },
        { name: 'Prepay', value: 'prepay' }
      ],
      owners: [
        { name: 'Teosite', value: 'teosite' },
        { name: 'Customer', value: 'user' }
      ],
      planInfo: {
        is_active: true,
        customer: null,
        name: null,
        price: null,
        susbcription_period: null,
        payment_term: null,
        max_idle_after_shipment: null,
        to_be_returned_after_service_end: null,
        notification_before_service_end: null,
        camera_model: null,
        ownership_type: null,
        notes: null
      },
      required: [(v) => !!v || 'Required'],
      breadcrumbs: [
        {
          text: 'Plans',
          disabled: false,
          to: '/plans'
        },
        {
          text: 'Edit Plan',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      customers: (store) => store.customer.accounts,
      deviceModels: (store) => store.firmware.device_models
    }),
    customerList() {
      let customersArray = [
        { id: 1, first_name: 'No Specific Customer', last_name: '', email: 1 }
      ]

      if (this.customers && this.customers.length) {
        customersArray = [...customersArray, ...this.customers]
      }

      return customersArray
    },
    planTypes() {
      let typesArray = [
        // {
        //   id: 1,
        //   name: 'Subscription Only'
        // }
      ]

      if (this.deviceModels && this.deviceModels.length) {
        typesArray = [...typesArray, ...this.deviceModels]
      }

      return typesArray
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true
      await this.$store.dispatch('plan/getPlan', this.$route.params.id).then((resp) => {
        this.planInfo = {
          ...resp,
          customer: resp.customer && resp.customer.id ? resp.customer.id : resp.customer
        }
        this.isLoading = false
      }).finally(() => {
        this.isLoading = false
      })

      this.$store.dispatch('customer/getAccounts')
      this.$store.dispatch('firmware/getDeviceModels')
    },
    updateStatus() {
      // Update Plan Status
    },
    async editPlan() {
      if (this.$refs.form.validate()) {
        const data = { ...this.planInfo }

        if (data.customer === 1) {
          data.customer = null
        }

        if (data.camera_model === 'Subscription Only') {
          data.camera_model = null
        }

        data.price = Number(data.price)
        data.susbcription_period = Number(data.susbcription_period)
        data.max_idle_after_shipment = Number(data.max_idle_after_shipment)
        data.to_be_returned_after_service_end = Number(data.to_be_returned_after_service_end)
        data.notification_before_service_end = Number(data.notification_before_service_end)

        this.editLoading = true
        await this.$store
          .dispatch('plan/editPlan', data)
          .then(() => {
            this.editLoading = false
            this.$router.push('/plans')
          })
          .catch(() => {
            this.editLoading = false
          })
      }
    },

    async resetForm() {
      this.$refs.form.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
