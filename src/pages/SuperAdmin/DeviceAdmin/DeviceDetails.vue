<template>
  <div class="d-flex flex-column flex-grow-1">
    <div>
      <div class="display-1">
        Device Details
      </div>
      <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      <v-card class="mt-3">
        <v-tabs
          v-model="tab"
          background-color="transparent"
          class="text-capitalize"
          align-with-title
        >
  
          <v-tab v-for="item in tabs" :key="item.id" class="text-capitalize">
            {{ item.name }}
          </v-tab>
        </v-tabs>
      </v-card>
  
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <AddEditModel
            v-if="modelId"
            :edit="true"
            :add="false"
            class="mt-3"
            @close="addModal = false"
          />
        </v-tab-item>
        <v-tab-item>
          <ScheduleProfiles :model-id="modelId" tab="schedule-profile" class="mt-3" />
        </v-tab-item>
        <v-tab-item>
          <CameraProfiles :model-id="modelId" tab="camera-profile" class="mt-3" />
        </v-tab-item>
        <v-tab-item>
          <SettingProfiles :model-id="modelId" tab="setting-profile" class="mt-3" />
        </v-tab-item>
        <v-tab-item>
          <Firmwares :model-id="modelId" tab="ota-firmware" class="mt-3" />
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>
  
<script>
import SettingProfiles from './SettingProfile/SettingProfiles'
import CameraProfiles from './CameraProfile/CameraProfiles'
import ScheduleProfiles from './ScheduleProfile/ScheduleProfiles'
import Firmwares from './Firmware/Firmwares'
import AddEditModel from './AddEditModel'
  
export default {
  components: { AddEditModel, SettingProfiles, CameraProfiles, ScheduleProfiles, Firmwares },
  data() {
    return {
      modelId: this.$route.params.id,
      tab: 0,
      tabs: [
        {
          id: 0,
          key: 'general-info',
          name: 'Device General Info'
        },  
        {
          id: 1,
          key: 'schedule-profile',
          name: 'Schedule Profile'
        },
        {
          id: 2,
          key: 'camera-profile',
          name: 'Camera Profile'
        },
        {
          id: 3,
          key: 'setting-profile',
          name: 'Setting Profile'
        },
        {
          id: 4,
          key: 'ota-firmware',
          name: 'OTA & Firmware'
        }
      ],
      breadcrumbs: [
        {
          text: 'Device Models',
          disabled: false,
          to: '/device-admin'
        },
        {
          text: 'Device Details',
          disabled: true
        }
      ]
    }
  },
  watch: {
    tab(val) {
      if (val >= 0) {
        const item = this.tabs.find((tab) => tab.id === val)
  
        if (item && this.$route.query.tab !== item.key) {
          this.$router.replace({ query: { tab: item.key } })
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.tab) {
      this.setTab()
    }
  },
  methods: {
    setTab() {
      const tabName = this.$route.query.tab
  
      if (tabName === 'general-info') {
        this.tab = 0
      }

      if (tabName === 'schedule-profile') {
        this.tab = 1
      }
  
      if (tabName === 'camera-profile') {
        this.tab = 2
      }
  
      if (tabName === 'setting-profile') {
        this.tab = 3
      }
  
      if (tabName === 'ota-firmware') {
        this.tab = 4
      }
  
    }
  }
}
</script>
