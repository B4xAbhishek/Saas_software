<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Inventory</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="grey lighten-1" @click="returnModal = true">
        Return
      </v-btn>
      <v-btn color="primary" class="ml-1" to="/inventory/add-camera">
        Add New
      </v-btn>
    </div>

    <div v-if="stats" class="d-flex flex-wrap align-center mb-3">
      <div class="d-flex align-center">
        <strong class="primary--text cursor-pointer" :class="!filterBy && 'text-underline'" @click="setFilter(null)">Total: </strong>
        <strong class="ml-2">{{ totalDevices }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'in_inventory' && 'text-underline'" @click="setFilter('in_inventory')">In Inventory: </strong>
        <strong class="ml-2">{{ stats.in_inventory || 0 }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'on_site' && 'text-underline'" @click="setFilter('on_site')">On Site: </strong>
        <strong class="ml-2">{{ stats.on_site || 0 }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'out_of_service' && 'text-underline'" @click="setFilter('out_of_service')">Out of service: </strong>
        <strong class="ml-2">{{ stats.out_of_service || 0 }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'lost_or_stolen' && 'text-underline'" @click="setFilter('lost_or_stolen')">Lost: </strong>
        <strong class="ml-2">{{ stats.lost_or_stolen || 0 }}</strong>
      </div>
      <div class="d-flex align-center">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'sold' && 'text-underline'" @click="setFilter('sold')">Sold: </strong>
        <strong class="ml-2">{{ stats.sold || 0 }}</strong>
      </div>
      <div class="d-flex align-center mx-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'in_repair' && 'text-underline'" @click="setFilter('in_repair')">Repair: </strong>
        <strong class="ml-2">{{ stats.in_repair || 0 }}</strong>
      </div>
      <div class="d-flex align-center">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'retiered' && 'text-underline'" @click="setFilter('retiered')">Retiered: </strong>
        <strong class="ml-2">{{ stats.retiered || 0 }}</strong>
      </div>
      <div class="d-flex align-center ml-2">
        <strong class="primary--text cursor-pointer" :class="filterBy === 'in_assigned_order' && 'text-underline'" @click="setFilter('in_assigned_order')">Assigned to Order: </strong>
        <strong class="ml-2">{{ stats.in_assigned_order || 0 }}</strong>
      </div>
    </div>

    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center" align="center">
        <v-col cols="6">
        </v-col>
        <v-col cols="6" class="text-right d-flex align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-1"
            solo
            hide-details
            dense
            clearable
            placeholder="filter for S/N, ICCID, IMEI etc"
            @keyup.enter="onFilterData"
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

      <template v-if="deviceList && deviceList.length < 1">
        <div class="text-center mb-5">
          No <strong v-if="filterBy" class="primary--text text-capitalize">{{ filterBy.replaceAll('_', ' ') }}</strong> device found...
        </div>
      </template>

      <template v-if="deviceList && deviceList.length">
        <ejs-grid
          :data-source="deviceList"
          :allow-resizing="true"
          :selection-settings="selectionSettings"
          :allow-filtering="true"
          :filter-settings="filterOptions"
          :allow-selection="true"
          :allow-sorting="true"
          :allow-reordering="true"
          :enable-hover="true"
          :enable-header-focus="true"
          :row-height="50"
        >
          <e-columns>
            <e-column
              field="SN"
              header-text="SN/IMEI"
              min-width="120"
              width="210"
              template="snTemp"
            ></e-column>
            <e-column
              field="ICCID"
              header-text="ICCID"
              min-width="8"
              width="200"
              template="iccidTemp"
            ></e-column>
            <e-column field="service_status" header-text="Status" min-width="8" width="140"></e-column>
            <e-column field="network_status" header-text="Network" min-width="8" width="150"></e-column>
            <e-column
              field="inventory_status"
              header-text="Inventory"
              min-width="8"
              width="160"
              template="inventoryTemp"
            ></e-column>
            <e-column
              field="battery"
              header-text="Battery"
              min-width="8"
              width="140"
              template="batteryTemp"
            ></e-column>
            <e-column
              field="signal"
              header-text="Signal"
              min-width="8"
              width="135"
              template="signalTemp"
            ></e-column>
            <e-column
              field="customer.company_name"
              header-text="Customer"
            ></e-column>
            <e-column field="project.name" header-text="Project"></e-column>
            <e-column field="location.name" header-text="Location"></e-column>
            <e-column field="position.name" header-text="Position" min-width="8" width="150"></e-column>
            <e-column
              field="firmware.version"
              header-text="FW ver"
              min-width="8"
              width="150"
              template="actionTemp"
            ></e-column>
            
            <template v-slot:snTemp="{ data }">
              <copy-label :text="data.SN + ''" />
            </template>
            <template v-slot:iccidTemp="{ data }">
              <copy-label :text="data.ICCID + ''" />
            </template>
            <template v-slot:batteryTemp="{ data }">
              <span>{{ data.battery_level }}%</span>
            </template>
            <template v-slot:inventoryTemp="{ data }">
              <span>{{ data.inventory_status.replaceAll('_', ' ') }}</span>
            </template>
            <template v-slot:signalTemp="{ data }">
              <span>{{ data.signal_level }}%</span>
            </template>
            <template v-slot:actionTemp="{ data }">
              <strong class="edit-inventory link" @click="editDevice(data.id)">{{ data.firmware.version }}</strong>
              <!-- <router-link :to="`/inventory/edit/${data.SN}`">Edit</router-link> -->
              <!-- <v-icon @click="$router.push(`/inventory/edit/${data.SN}`)">mdi-pencil</v-icon> -->
            </template>
          </e-columns>
        </ejs-grid>
        
        <!-- <ag-grid-vue
          style="width: 100%; height: 500px;"
          class="ag-theme-alpine px-3"
          :column-defs="columnDefs"
          row-class="ag-row-class"
          :default-col-def="defaultColDef"
          :row-data="deviceList"
          :cache-quick-filter="true"
          @grid-ready="onGridReady"
        >
        </ag-grid-vue> -->
        <v-pagination
          v-model="pagination.page"
          class="my-4"
          :length="pagination.totalPages"
          @input="onPageChange"
        ></v-pagination>
        <!-- <v-data-table
          v-model="selectedAccounts"
          show-select
          :headers="headers"
          :items="accountList"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="goToAccount"
        >

          <template v-slot:[`item.disabled`]="{ item }">
            <v-chip
              small
              :color="item.disabled ? 'red' : 'primary'"
              dark
            ><span class="white--text">{{ item.disabled ? 'Disabled' : 'Active' }}</span></v-chip>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-btn icon :to="`/admin/users/${item.email}`">
                <v-icon>mdi-account-edit</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table> -->
      </template>
    </v-card>

    <ReturnCamera v-if="returnModal" :return-modal="returnModal" @returned="refresh" @close="returnModal = false" />
  </div>
</template>

<script>
import Vue from 'vue'
import CopyLabel from '@/components/common/CopyLabel'
// import { AgGridVue } from 'ag-grid-vue'
import { GridPlugin, Toolbar, Reorder, Resize, Sort, Filter, Selection, GridComponent, leftRight } from '@syncfusion/ej2-vue-grids'
import { DropDownList, DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { mapState } from 'vuex'
import ReturnCamera from './ReturnCamera'

Vue.use(GridPlugin)
Vue.use(DropDownListPlugin)

export default {
  components: { CopyLabel, ReturnCamera },
  provide: {
    grid: [Resize, Toolbar, Reorder, Filter, Selection, Sort]
  },
  data() {
    return {
      isLoading: false,
      inviteModal: false,
      returnModal: false,
      searchQuery: '',
      filterBy: null,
      gridApi: null,
      gridColumnApi: null,
      paginationNumberFormatter: null,
      columnDefs: [],
      defaultColDef: {
        resizable: true
      },

      toolbar: ['Search'],

      filterOptions: {
        type: 'Menu'
      },
      selectionSettings: { persistSelection: true, type: 'Multiple', checkboxOnly: true },

      breadcrumbs: [{
        text: 'Inventory',
        disabled: true,
        to: '/accounts'
      }, {
        text: 'List',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      inventory: (store) => store.device.inventory
    }),
    stats() {
      return this.inventory && this.inventory.count
    },
    totalDevices () {
      return this.inventory && this.inventory.count.total
    },
    deviceList() {
      return this.inventory && this.inventory.cameras
    },
    pagination() {
      return this.inventory && this.inventory.pagination
    }
  },
  beforeMount() {
    this.columnDefs = [
      { headerName: 'S/N', field: 'SN', sortable: true, filter: true },
      { field: 'ICCID', sortable: true, filter: true },
      { field: 'IMEI', sortable: true, filter: true },
      { headerName: 'Battery', field: 'battery_level', valueFormatter: (params) => params.value + '%', sortable: true, filter: true },
      { field: 'signal_level', sortable: true, filter: true },
      { field: 'model.name', sortable: true, filter: true },
      { field: 'project', sortable: true, filter: true },
      { field: 'location.name', sortable: true, filter: true },
      { headerName: 'Position', field: 'position.name', sortable: true, filter: true },
      { headerName: 'Connection', field: 'network_status', sortable: true, filter: true },
      { headerName: 'Ownership', field: 'is_owned_by_customer', sortable: true, filter: true }
    ]
  },

  created() {
    this.loadInventory()
  },
  methods: {
    searchUser() {},
    open() {},
    editDevice(id) {
      this.$router.push(`/inventory/edit/${id}`)
    },
    onGridReady(params) {
      this.gridApi = params.api
      this.gridColumnApi = params.columnApi

      this.autoSizeAll(true)
    },
    autoSizeAll(skipHeader) {
      const allColumnIds = []

      // this.gridColumnApi.getColumns().forEach((column) => {
      //   allColumnIds.push(column.getId())
      // })
      // this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader)
    },
    onFilterData() {
      // this.gridApi.setQuickFilter(this.searchQuery)
      this.loadInventory()
    },
    // toolbarClick(args) {
    //   console.log(args)
    //   if (args.item.text === 'Refresh') {
    //     this.refresh()
    //   }
    // },
    goToAccount(item) {
      this.$router.push(`/accounts/${item.email}`)
    },
    onPageChange(value) {
      this.loadInventory({ page: value })
    },
    refresh() {
      this.returnModal = false
      this.loadInventory()
    },
    setFilter(status) {
      this.filterBy = status
      this.loadInventory()
    },
    async loadInventory(payload = {}) {
      if (this.filterBy) {
        if (!payload) {
          payload = {
            status: this.filterBy,
            search: ''
          }
        } else {
          payload.status = this.filterBy
        }
      }

      if (this.searchQuery) {
        payload.search = this.searchQuery
      } else {
        delete payload.search
      }

      this.isLoading = true
      await this.$store.dispatch('device/getDeviceInventory', payload).then((resp) => {
        this.paginationNumberFormatter = (params) => {
          return '[' + params.value.toLocaleString() + ']'
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
    // paginateUsers(value) {
    //   this.loadAccounts({ page: value })
    // }
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

.ag-theme-alpine .ag-header {
    font-family: cursive;
}
.ag-theme-alpine .ag-header-group-cell {
    font-weight: normal;
    font-size: 22px;
}
.ag-theme-alpine .ag-header-cell {
    font-size: 18px;
}

.edit-inventory {
  color: var(--v-primary-lighten1) !important;
  :hover {
    cursor: pointer;
  }
}
</style>