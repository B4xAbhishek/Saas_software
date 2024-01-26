<template>
  <div>
    <v-dialog v-model="contactModal" persistent max-width="500">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">{{ add ? 'Add' : 'Edit' }} Contact</h2>
            </div>
            <v-icon @click="close">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
  
          <v-form ref="form" lazy-validation @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="contact.name"
                  label="Full Name"
                  :rules="[v => !!v || 'Full Name is Required']"
                ></v-text-field>
                <v-text-field
                  v-model="contact.email"
                  label="Email"
                  type="email"
                  :rules="[v => !!v || 'Email is Required']"
                ></v-text-field>
                <!-- Phone Validation will be added later -->
                <v-text-field
                  v-model="contact.phone"
                  label="Phone"
                  :rules="[v => !!v || 'Phone is Required']"
                ></v-text-field>
                <v-combobox
                  v-model="contact.company"
                  label="Company"
                  multiple
                  small-chips
                  deletable-chips
                  :items="[]"
                  :rules="[v => !!v || 'Company is Required']"
                ></v-combobox>
                <v-combobox
                  v-model="contact.type"
                  label="Subcontractor Type (trade)"
                  multiple
                  small-chips
                  deletable-chips
                  :items="['Excavation', 'Fottings & Foundations', 'Framing', 'Windows', 'HVAC-Plumbing-Electrical', 'Insulation', 'Drywall', 'Exterior work', 'Inspection']"
                  :rules="[v => !!v || 'Subcontractor Type is Required']"
                ></v-combobox>
                
                <div class="mt-1">
                  <v-btn type="submit" color="primary" class="mr-1">Save</v-btn>
                  <v-btn color="grey lighten-2" @click="close">Cancel</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script>
export default {
  props: {
    contactModal: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    contactInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      contact: {
        name: null,
        email: null,
        phone: null,
        type: [],
        company: []
      }
    }
  },
  created() {
    if (this.contactInfo && !this.add) {
      this.contact = { ...this.contactInfo }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>