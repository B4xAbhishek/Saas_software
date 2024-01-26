<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" class="mr-1" outlined>Bulk Import</v-btn> -->
      <v-btn color="primary" @click="addNew"> Add Contact</v-btn>
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
            placeholder="e.g. filter for contacts"
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

    <Contact
      v-if="contactModal"
      :contact-modal="contactModal"
      :contact-info="contactToEdit"
      :add="add"
      @close="contactModal = false"
    />

    <DeleteContact
      v-if="deleteContactModal"
      :dialog="deleteContactModal"
      :contact-info="contactToDelete"
      @close="deleteContactModal = false"
    />
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import Contact from './Contact'
import DeleteContact from './DeleteContact'
    
export default {
  components: {
    Contact,
    DeleteContact
  },
  data() {
    return {
      isLoading: false,
      add: false,
      searchQuery: '',
      contactModal: false,
      deleteContactModal: false,
      contactToEdit: null,
      contactToDelete: null,
      selectedPlans: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Company', value: 'company' },
        { text: 'Phone', value: 'phone' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions' }
      ],
      managers: [
        { id: 1, type: ['Excavation'], name: 'Joe Shmoe', company: ['XYZ excavations'], phone: '801-555-5555', email: 'joe.shmoe@email.com' },
        { id: 2, type: ['Footings foundations'], name: 'Dave SMith', company: ['ABC Foundations'], phone: '435-555-5555', email: 'joe.shmoe@email.com' }
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
      this.contactToEdit = { ...item }
      this.contactModal = true
    },
    remove(item) {
      this.contactToDelete = { ...item }
      this.deleteContactModal = true
    },
    addNew() {
      this.add = true
      this.contactModal = true
    },
    refresh() {
      this.contactModal = false
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
