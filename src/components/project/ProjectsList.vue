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
      <v-col cols="12" md="4" offset-md="8" class="d-flex text-right align-center">
        <v-text-field
          v-model="searchQuery"
          append-icon="mdi-magnify"
          class="flex-grow-1 mr-md-2"
          solo
          hide-details
          dense
          clearable
          placeholder="Search Project"
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
        v-if="$vuetify.breakpoint.mdAndUp"
        v-model="selectedProjects"
        item-key="name"
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

        <template v-slot:[`item.address.street`]="{ item }">
          {{ (item.address.street ? item.address.street + ', ' : '') + item.address.city }}
        </template>

        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            small
            :color="getColor(item)"
          ><span class="white--text text-capitalize">{{ item.status || 'N/A' }}</span></v-chip>
        </template>

        <template v-slot:[`item.lots`]="{}">
          <div>No Lot</div>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <div class="actions">
            <v-menu bottom origin="center center" transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item v-if="!admin" icon @click="editProject(item)">
                  <v-list-item-icon>
                    <v-icon color="primary" size="20">mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>

                <v-list-item v-else icon @click="goToProject(item)">
                  <v-list-item-icon>
                    <v-icon color="primary" size="20">mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <!-- <v-btn v-if="!admin" icon :to="`/projects/${item.name}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn v-else icon :to="`/admin/projects/${item.name}`">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn> -->
          </div>
        </template>
      </v-data-table>

      <template v-if="$vuetify.breakpoint.smAndDown">
        <v-list>
          <template v-for="(project, index) in projectList">
            <v-divider
              v-if="index > 0"
              :key="index"
              :inset="true"
            ></v-divider>

            <v-list-item
              :key="project.name"
              @click="goToProject(project)"
            >
              <v-list-item-avatar color="primary" size="48">
                <span class="white--text text-h5 text-capitalize">{{ project.name.charAt(0) }}</span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ project.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ (project.address.street ? project.address.street + ', ' : '') + project.address.city }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  small
                  :color="getColor(project)"
                  class="px-0"
                ><span class="white--text text-capitalize px-0">{{ project.status || 'N/A' }}</span></v-chip>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </template>
      
      <v-pagination
        v-model="pagination.page"
        :length="pagination.pagingCounter"
        @input="paginateProjects"
      ></v-pagination>
    </template>

    <template v-if="$vuetify.breakpoint.smAndDown && projectList && projectList.length && pagination">
      
    </template>

    <AddEditProject
      v-if="addEditModal"
      :open="addEditModal"
      :edit="isEdit"
      :project-info="projectToEdit"
      @refresh="refresh"
      @close="addEditModal = false"
    />
  </v-card>
</template>

<script>
import CopyLabel from '@/components/common/CopyLabel'
import AddEditProject from '@/components/project/AddEditProject'
export default {
  name: 'ProjectList',
  components: { CopyLabel, AddEditProject },
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
      addEditModal: false,
      projectToEdit: null,
      isEdit: false,
      headers: [
        { text: 'Projects', value: 'name', sortable: true, filterable: true },
        { text: 'Location', value: 'address.street', filterable: true, sortable: true },
        { text: 'Status', value: 'status', filterable: true, sortable: true },
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
    getColor(item) {
      const { status } = item

      switch (status) {
      case 'active':
        return 'primary'
      case 'cancelled':
        return 'dark'
      case 'finished':
        return 'info'
      default:
        return 'grey' 
      }
    },
    goToProject(item) {
      if (this.admin) {
        this.$router.push(`/admin/projects/${item.id}`)
      } else {
        this.$router.push(`/projects/${item.id}`)
      }
    },
    editProject(item) {
      this.projectToEdit = { ...item }
      this.isEdit = true
      this.addEditModal = true
    },
    refresh() {
      this.addEditModal = false
      this.isEdit = false
      this.$emit('refresh', true)
    },
    paginateProjects(value) {
      this.$emit('paginate', value)
    }
  }
}
</script>
