<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Administration</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn to="/admin/projects/add" color="primary">
        New Project
      </v-btn>
    </div>

    <ProjectsList
      :project-list="projectList"
      :pagination-obj="pagination"
      :is-loading="isLoading"
      :admin="true"
      @refresh="loadProjects"
      @paginate="paginateProjects"
    />
  </div>
</template>

<script>
import ProjectsList from '@/components/project/ProjectsList'
import { mapState } from 'vuex'

export default {
  components: {
    ProjectsList
  },
  data() {
    return {
      isLoading: false,
      breadcrumbs: [{
        text: 'Administrator',
        disabled: true,
        to: '/admin/projects'
      }, {
        text: 'Projects',
        disabled: true,
        to: '/admin/projects'
      }, {
        text: 'List',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      projects: (store) => store.project.projects
    }),
    projectList() {
      return this.projects ? this.projects.projects : []
    },
    pagination() {
      return this.projects && this.projects.pagination
    }
  },
  watch: {
    selectedProjects(val) {

    }
  },
  created() {
    this.loadProjects()
  },
  methods: {
    searchUser() {},
    open() {},
    async loadProjects(payload = null) {
      this.isLoading = true
      await this.$store.dispatch('project/getProjects', payload)
      this.isLoading = false
    },
    paginateProjects(value) {
      this.loadProjects({ page: value })
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
