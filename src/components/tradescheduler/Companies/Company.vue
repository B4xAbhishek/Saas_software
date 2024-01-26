<template>
  <div>
    <v-dialog v-model="companyModal" persistent max-width="500">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">{{ add ? 'Add' : 'Edit' }} Company</h2>
            </div>
            <v-icon @click="close">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
  
          <v-form ref="form" lazy-validation @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="company.name"
                  label="Company Name"
                  :rules="[v => !!v || 'Company Name is Required']"
                ></v-text-field>
                <v-autocomplete
                  v-model="company.type"
                  label="Type"
                  multiple
                  small-chips
                  deletable-chips
                  :items="['Excavation', 'Fottings & Foundations', 'Framing', 'Windows', 'HVAC-Plumbing-Electrical', 'Insulation', 'Drywall', 'Exterior work', 'Inspection']"
                  :rules="[v => !!v || 'Trade is Required']"
                ></v-autocomplete>
  
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
    companyModal: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    },
    companyInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      company: {
        name: null,
        type: []
      }
    }
  },
  created() {
    if (this.companyInfo && !this.add) {
      this.company = { ...this.companyInfo }
    } else {
      this.company.name = null
      this.company.type = []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>