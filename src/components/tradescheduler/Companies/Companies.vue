<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" class="mr-1" outlined>Bulk Import</v-btn> -->
      <v-btn color="primary" @click="addNew"> Add Company</v-btn>
    </div>
    
    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6" offset="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for companies"
          ></v-text-field>
          <v-btn
            :loading="isLoading"
            icon
            small
            class="ml-2"
            @click="refresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    
      <template>
        <v-data-table
          v-model="selectedPlans"
          :headers="headers"
          :items="managers"
          item-key="id"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="edit"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon color="info" @click.stop="edit(item)">mdi-pencil</v-icon>
            <v-icon color="red" @click.stop="remove(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </template>
    </v-card>

    <Company
      v-if="companyModal"
      :company-modal="companyModal"
      :company-info="companyToEdit"
      :add="add"
      @close="companyModal = false"
    />

    <DeleteCompany
      v-if="deleteCompanyModal"
      :dialog="deleteCompanyModal"
      :company-info="companyToDelete"
      @close="deleteCompanyModal = false"
    />
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import Company from './Company'
import DeleteCompany from './DeleteCompany.vue'
    
export default {
  components: {
    Company,
    DeleteCompany
  },
  data() {
    return {
      isLoading: false,
      add: false,
      searchQuery: '',
      companyModal: false,
      deleteCompanyModal: false,
      companyToEdit: null,
      companyToDelete: null,
      selectedPlans: [],
      headers: [
        { text: 'Company', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Actions', value: 'actions' }
      ],
      managers: [
        { id: 1, type: ['Excavation'], name: 'XYZ excavations' },
        { id: 2, type: ['Footings foundations'], name: 'ABC Foundations' }
      ]
    }
  },
  computed: {
    ...mapState({
      deviceModels: (store) => store.firmware.device_models
    })
  },
  created() {
    // this.loadDeviceModels()
  },
  methods: {
    searchUser() {},
    open() {},
    edit(item) {
      this.add = false
      this.companyToEdit = { ...item }
      this.companyModal = true
    },
    remove(item) {
      this.companyToDelete = { ...item }
      this.deleteCompanyModal = true
    },
    addNew() {
      this.add = true
      this.companyModal = true
    },
    refresh() {
      this.companyModal = false
      // this.loadDeviceModels()
    },
    async loadDeviceModels() {
      this.$store.dispatch('firmware/getDeviceModels').then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
