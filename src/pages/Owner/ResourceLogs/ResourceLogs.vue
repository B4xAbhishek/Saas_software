<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Resource Logs</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="grey lighten-2">
        Report
      </v-btn>
    </div>
  
    <v-card>
      <v-card-text>
        <v-row no-gutters>
          <v-col
            cols="6"
            sm="6"
            md="4"
            lg="2"
            class="my-2 px-1"
          >
            <v-autocomplete
              :items="[{ name: 'XYZ', id: '12345' }]"
              item-value="id"
              item-text="name"
              outlined
              dense
              label="Project"
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="2"
            class="my-2 px-1"
          >
            <v-autocomplete
              :items="[{ name: 'LOT 3', id: '123456' }]"
              item-value="id"
              item-text="name"
              outlined
              dense
              label="Location"
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="2"
            class="my-2 px-1"
          >
            <v-autocomplete
              :items="[{ name: 'Joe Shmoe', id: '123456' }]"
              item-value="id"
              item-text="name"
              outlined
              dense
              label="Name"
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="2"
            class="my-2 px-1"
          >
            <v-autocomplete
              :items="[{ name: 'XYZ Contracting', id: '123456' }]"
              item-value="id"
              item-text="name"
              outlined
              dense
              label="Company"
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="2"
            class="my-2 px-1"
          >
            <v-menu
              v-model="datePicker"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.date"
                  label="Date"
                  dense
                  hide-details
                  outlined
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filters.date"
                no-title
                @input="datePicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="1"
            class="my-2 px-1"
          >
            <v-menu
              ref="menu"
              v-model="checkin"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.checkin"
                  label="Onsite"
                  dense
                  outlined
                  hide-details
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="checkin"
                v-model="filters.checkin"
                full-width
                @click:minute="$refs.menu.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col
            cols="6"
            sm="4"
            md="4"
            lg="1"
            class="my-2 px-1"
          >
            <v-menu
              ref="menu1"
              v-model="checkout"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filters.checkout"
                  label="Onsite Last"
                  dense
                  outlined
                  hide-details
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="checkout"
                v-model="filters.checkout"
                full-width
                @click:minute="$refs.menu1.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <template>
          <ejs-grid
            :data-source="resourceLogs"
            :allow-resizing="true"
            :selection-settings="selectionSettings"
            :allow-filtering="true"
            :filter-settings="filterOptions"
            :allow-selection="true"
            :allow-sorting="true"
            :allow-reordering="true"
            :enable-hover="true"
            :toolbar="toolbar"
            :enable-header-focus="true"
            :row-height="50"
          >
            <e-columns>
              <e-column
                field="project"
                header-text="Project"
              ></e-column>
              <e-column
                field="location"
                header-text="Location"
              ></e-column>
              <e-column
                field="name"
                header-text="Name"
              ></e-column>
              <e-column
                field="company"
                header-text="Company"
              ></e-column>
              <e-column
                field="date"
                header-text="Date"
              ></e-column>
              <e-column
                field="onsite"
                header-text="Onsite"
              ></e-column>
              <e-column
                field="onsite_last"
                header-text="Onsite Last"
              ></e-column>
            </e-columns>
          </ejs-grid>
        </template>
      </v-card-text>
    </v-card>
  
  </div>
</template>
  
<script>
import Vue from 'vue'
// import { AgGridVue } from 'ag-grid-vue'
import { GridPlugin, Toolbar, Reorder, Resize, Sort, Filter, Selection, GridComponent, leftRight } from '@syncfusion/ej2-vue-grids'
import { DropDownList, DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { mapState } from 'vuex'
  
Vue.use(GridPlugin)
Vue.use(DropDownListPlugin)
  
export default {
  components: { },
  provide: {
    grid: [Resize, Toolbar, Reorder, Filter, Selection, Sort]
  },
  data() {
    return {
      isLoading: false,
      resourceLogs: [],
      searchQuery: '',
      filterBy: null,
      gridApi: null,
      gridColumnApi: null,
      paginationNumberFormatter: null,
      datePicker: false,
      checkin: false,
      checkout: false,
      columnDefs: [],
      defaultColDef: {
        resizable: true
      },
  
      toolbar: ['Search'],
  
      filterOptions: {
        type: 'Menu'
      },
      selectionSettings: { persistSelection: true, type: 'Multiple', checkboxOnly: true },

      filters: {
        date: null,
        checkin: null,
        checkout: null
      },
  
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
    
  beforeMount() {
    this.columnDefs = [
      { headerName: 'Project', field: 'project', sortable: true, filter: true },
      { headerName: 'Location', field: 'location', sortable: true, filter: true },
      { headerName: 'Name', field: 'name', sortable: true, filter: true },
      { headerName: 'Company', field: 'company', sortable: true, filter: true },
      { headerName: 'Date', field: 'date', sortable: true, filter: true },
      { headerName: 'Onsite', field: 'onsite', sortable: true, filter: true },
      { headerName: 'Onsite-Last', field: 'onsite_last', sortable: true, filter: true }
    ]
  },
  
  created() {
    this.resourceLogs = [
      {
        id: 1,
        project: 'XYZ',
        location: 'LOT 3',
        name: 'Joe Shmoe',
        company: 'XYZ Contracting',
        date: '11/22/23',
        onsite: '8:00 AM',
        onsite_last: '3:30 PM'
      },
      {
        id: 2,
        project: 'ABC',
        location: 'LOT 4',
        name: 'John Doe',
        company: 'XYZ Contracting',
        date: '11/22/23',
        onsite: '8:00 AM',
        onsite_last: '3:30 PM'
      }
    ]
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
      this.gridApi.setQuickFilter(this.searchQuery)
    }
    // toolbarClick(args) {
    //   console.log(args)
    //   if (args.item.text === 'Refresh') {
    //     this.refresh()
    //   }
    // },
    //   refresh() {
    //     this.returnModal = false
    //     this.loadInventory()
    //   },
    //   setFilter(status) {
    //     this.filterBy = status
    //     this.loadInventory()
    //   },
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
