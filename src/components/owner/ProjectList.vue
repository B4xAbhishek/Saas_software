<template>
  <v-card>
    <!-- users list -->
    <v-row dense class="pa-2 align-center">
      <v-col cols="6">
        <v-menu offset-y left>
          <template v-slot:activator="{ on }">
            <transition name="slide-fade" mode="out-in">
              <v-btn v-show="selectedProjects.length > 0" v-on="on">
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
          placeholder="e.g. filter for id, email, name, etc"
          @keyup.enter="searchUser(searchQuery)"
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

    <template v-if="projectList && projectList.length && pagination">
      <v-data-table
        v-model="selectedProjects"
        show-select
        :headers="headers"
        :items="projectList"
        :search="searchQuery"
        :loading="isLoading"
        class="flex-grow-1 cursor-pointer"
        :page.sync="pagination.page"
        :items-per-page="pagination.limit"
        hide-default-footer
        @click:row="goToProject"
        @page-count="pagination.pagingCounter = $event"
      >
        <template v-slot:[`item.id`]="{ item }">
          <div class="font-weight-bold">
            # <copy-label :text="item.id + ''" />
          </div>
        </template>
        <template v-slot:[`item.location`]="{ item }">
          <div>{{ item.add_1 }}, {{ item.add_2 }}, {{ item.city }}</div>
        </template>

        <template v-slot:[`item.status`]="{}">
          <v-chip
            small
            color="primary"
            dark
          ><span class="white--text">Active</span></v-chip>
        </template>

        <template v-slot:[`item.lots`]="{}">
          <div>No Lot</div>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <div class="actions">
            <v-btn v-if="!admin" icon :to="`/owner/project/${item.name}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn v-else icon :to="`/owner/project/${item.name}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
      <v-pagination
        v-model="pagination.page"
        :length="pagination.pagingCounter"
        @input="paginateProjects"
      ></v-pagination>
    </template>
  </v-card>
</template>

<script>
import CopyLabel from '@/components/common/CopyLabel'
export default {
  name: 'ProjectList',
  components: { CopyLabel },
  props: {
    projectList: { type: Array, default: null },
    paginationObj: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
  },
  data() {
    return {
      projects: [],
      pagination: null,
      searchQuery: '',
      selectedProjects: [],
      headers: [
        { text: 'Projects', value: 'name' },
        { text: 'Location', value: 'location' },
        { text: 'Lots', align: 'left', value: 'lots' },
        { text: 'Status', value: 'status' },
        { text: '', sortable: false, align: 'right', value: 'action' }
      ]
    }
  },
  watch: {
    projectList(val) {
      if (val && val.length) {
        this.projects = JSON.parse(JSON.stringify(val))
      }
    },
    paginationObj(val) {
      if (val) {
        this.pagination = JSON.parse(JSON.stringify(val))
      } 
    }
  },
  created() {
    if (this.projectList && this.projectList.length) {
      this.projects = JSON.parse(JSON.stringify(this.projectList))
    }
    if (this.paginationObj) {
      this.pagination = JSON.parse(JSON.stringify(this.paginationObj))
    }
  },
  methods: {
    searchUser() {},
    open() {},
    goToProject(item) {
      this.$router.push(`/owner/project/${item.name}`)
    },
    refresh() {
      this.$emit('refresh', true)
    },
    paginateProjects(value) {
      this.$emit('paginate', value)
    }
  }
}
</script>
