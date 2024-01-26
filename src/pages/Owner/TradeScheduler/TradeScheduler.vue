<template>
  <div class="trade-scheduler">
    <v-card>
      <v-tabs
        v-model="tab"
        background-color="transparent"
        class="text-capitalize"
        align-with-title
      >
        <v-tab>Resources</v-tab>
        <!-- <v-tab>Contacts</v-tab> -->
        <v-tab>Schedules</v-tab>
        <v-tab>Stages</v-tab>
        <v-tab>Positions</v-tab>
        <v-tab>Test</v-tab>
      </v-tabs>
    </v-card>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Resources />
      </v-tab-item>
      <!-- <v-tab-item>
        <Contacts />
      </v-tab-item> -->
      <v-tab-item>
        <Schedule />
      </v-tab-item>
      <v-tab-item>
        <Stages />
      </v-tab-item>
      <v-tab-item>
        <Positions />
      </v-tab-item>
      <v-tab-item>
        <Test />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// import Assign from '@/components/tradescheduler/Assign/Assign'
import Schedule from '@/components/tradescheduler/Schedule/Schedule'
import Resources from '@/components/tradescheduler/Resources/Resources'
// import Contacts from '@/components/tradescheduler/Contacts/Contacts'
import Stages from '@/components/tradescheduler/Stages/Stages'
import Positions from '@/components/tradescheduler/Positions/Positions'
import Test from '@/components/tradescheduler/Test'
export default {
  components: {
    Resources,
    // Assign,
    Schedule,
    // Contacts,
    Stages,
    Positions,
    Test
  },
  data() {
    return {
      tab: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.trade-scheduler {
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: auto
}
</style>