<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Projects</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="addEditModal = true"> New Project </v-btn>
    </div>

    <AddEditProject
      :open="addEditModal"
      :edit="false"
      @close="addEditModal = false"
      @refresh="loadProjects"
    />

    <ProjectsList
      :project-list="projectList"
      :pagination-obj="pagination"
      :is-loading="isLoading"
      @refresh="loadProjects"
      @paginate="paginateProjects"
    />
  </div>
</template>

<script>
import AddEditProject from '@/components/project/AddEditProject'
import ProjectsList from '@/components/project/ProjectsList'
import { mapState } from 'vuex'

export default {
  components: {
    AddEditProject,
    ProjectsList
  },
  data() {
    return {
      isLoading: false,
      addEditModal: false,
      breadcrumbs: [
        {
          text: 'Projects',
          disabled: true
        },
        {
          text: 'List',
          disabled: true
        }
      ]
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
    selectedProjects(val) {}
  },
  created() {
    this.loadProjects()
  },
  methods: {
    searchUser() {},
    open() {},
    async loadProjects(payload = null) {
      this.addEditModal = false
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
