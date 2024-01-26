<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Support</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="ticketDialog = !ticketDialog">
        Create Ticket
      </v-btn>
    </div>
  
    <div v-if="stats" class="d-flex flex-wrap align-center mb-3">
      <div class="d-flex align-center">
        <strong class="primary--text cursor-pointer" :class="!filterBy && 'text-underline'" @click="setFilter(null)">All Tickets: </strong>
        <strong class="ml-2">{{ stats.total || 0 }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'open' && 'text-underline'" @click="setFilter('open')">Open: </strong>
        <strong class="ml-2">{{ stats.open || 0 }}</strong>
      </div>
      <div class="d-flex align-center">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'closed' && 'text-underline'" @click="setFilter('closed')">Closed: </strong>
        <strong class="ml-2">{{ stats.closed || 0 }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'overdue' && 'text-underline'" @click="setFilter('overdue')">Overdue: </strong>
        <strong class="ml-2">{{ stats.overdue || 0 }}</strong>
      </div>
      <div class="d-flex align-center">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'hold' && 'text-underline'" @click="setFilter('hold')">Hold: </strong>
        <strong class="ml-2">{{ stats.hold || 0 }}</strong>
      </div>
    </div>
  
    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6">
          <v-menu offset-y left>
            <template v-slot:activator="{ on }">
              <transition name="slide-fade" mode="out-in">
                <v-btn v-show="selectedCustomers.length > 0" v-on="on">
                  Actions
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </transition>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Verify</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Disable</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for problem, status, priority"
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
          :headers="headers"
          :items="ticketList"
          item-key="id"
          :search="searchQuery"
          :loading="isLoading"
          :page.sync="pagination.page"
          :items-per-page="pagination.limit"
          class="flex-grow-1 cursor-pointer"
          hide-default-footer
          @click:row="goToTicket"
          @page-count="pagination.pagingCounter = $event"
        >
          <template v-slot:[`item.description`]="{ item }">
            <span class="pa-0" v-html="item.description"></span>
          </template>
          <template v-slot:[`item.created_on`]="{ item }">
            {{ new Date(item.created_on).toLocaleString() }}
          </template>
  
          <!-- <template v-slot:[`item.action`]="{ item }">
              <div class="actions">
                <v-btn icon :to="`/customers/${item.email}`">
                  <v-icon>mdi-account-edit</v-icon>
                </v-btn>
              </div>
            </template> -->
        </v-data-table>
        <v-pagination
          v-if="ticketList && ticketList.length"
          v-model="pagination.page"
          :length="pagination.pagingCounter"
          @input="paginateTickets"
        ></v-pagination>
      </template>
    </v-card>
  
    <CreateTicket
      v-if="ticketDialog"
      :customer="true"
      :ticket-dialog="ticketDialog"
      @close="ticketDialog = false"
      @refresh="refresh"
    />

    <EditTicket
      v-if="editTicketDialog"
      :customer="true"
      :item="ticketItem"
      :ticket-dialog="editTicketDialog"
      @close="editTicketDialog = false"
      @refresh="refresh"
    />
  </div>
</template>
    
<script>
import CreateTicket from '@/components/support/CreateTicket'
import EditTicket from '@/components/support/EditTicket'
import { mapState } from 'vuex'
  
export default {
  components: { CreateTicket, EditTicket },
  data() {
    return {
      isLoading: false,
      ticketDialog: false,
      editTicketDialog: false,
      searchQuery: '',
      selectedCustomers: [],
      ticketItem: null,
      filterBy: '',
      headers: [
        { text: 'ID', value: 'ticket_number' },
        { text: 'Problem', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Status', value: 'status' },
        { text: 'Priority', value: 'priority' },
        { text: 'Date Reported', value: 'created_on' }
      ],
      breadcrumbs: [{
        text: 'Support',
        disabled: true,
        to: '/support'
      }, {
        text: 'Ticket List',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      tickets: (store) => store.support.tickets
    }),
    ticketList() {
      return this.tickets ? this.tickets.tickets : []
    },
    stats() {
      return this.tickets && this.tickets.counts
    },
    totalTickets () {
      let sum = 0
  
      if (this.tickets && this.tickets.counts) {
        for (const item in this.tickets.counts) {
          sum = sum + this.tickets.counts[item]
        }
      }
  
      return sum
    },
    pagination() {
      if (this.tickets && this.tickets.pagination) {
        return this.tickets && this.tickets.pagination
      }
  
      return {
        page: 1,
        limit: 10
      }
    }
    // ticketList() {
    //   return this.customers
    // }
  },
  watch: {
  
  },
  created() {
    this.loadTickets()
  },
  methods: {
    searchUser() { },
    open() { },
    goToTicket(item) {
      this.ticketItem = { ...item }
      this.editTicketDialog = true
    },
    refresh() {
      this.ticketDialog = false
      this.editTicketDialog = false
      this.loadTickets()
    },
    async loadTickets(payload = null) {
      if (this.filterBy) {
        if (!payload) {
          payload = {
            status: this.filterBy
          }
        } else {
          payload.status = this.filterBy
        }
      }
  
      this.isLoading = true
      await this.$store.dispatch('support/getTickets', payload)
      this.isLoading = false
    },
    paginateTickets(value) {
      this.loadTickets({ page: value })
    },
    setFilter(status) {
      this.filterBy = status
      this.loadTickets()
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
