<template>
  <div class="locations-kanban">
    <v-row>
      <v-col cols="12">
        <div class="content-wrapper">

          <ejs-kanban
            id="kanban"
            class="py-2"
            css-class="e-width"
            key-field="stage"
            :data-source="positions"
            :card-settings="cardSettings"
            :dialog-settings="cardSettings.dialogSettings"
            :allow-drag-and-drop="true"
            :drag-start="onDragStart"
            :drag-stop="onDragStop"
          >
            <e-columns>
              <e-column v-for="(stage, index) in stages" :key="index" :header-text="stage" :key-field="stage"></e-column>
            </e-columns>
          </ejs-kanban>
        </div>  
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { extend, addClass } from '@syncfusion/ej2-base'
import ColumnTemplate from '@/components/common/kanban/ColumnTemplate.vue'
import CardTemplate from '@/components/common/kanban/CardTemplate.vue'
import { kanbanData } from '@/configs/kanban'
import { KanbanPlugin } from '@syncfusion/ej2-vue-kanban'

Vue.use(KanbanPlugin)

export default Vue.extend({
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      positions: [],
      stages: [],
      keyFields: '',
      kanbanData: extend([], kanbanData, null, true),
      allowToggle: true,
      enableTooltip: true,
      updatedPosition: null,
      cardSettings: {
        headerField: 'id',
        template: function() {
          return { template: CardTemplate }
        },
        dialogSettings: {
          fields: [
            { text: 'ID', key: 'Title', type: 'TextBox' },
            { key: 'Status', type: 'DropDown' },
            { key: 'Assignee', type: 'DropDown' },
            { key: 'RankId', type: 'TextBox' },
            { key: 'Summary', type: 'TextArea' }
          ]
        }
      }
    }
  },
  created() {
    this.stages = [...this.project.stages]
    this.stages.push('Unassigned')

    this.keyFields = this.stages.join(', ')

    this.getAllProjectLocations()
  },
  provide: {
    kanban: []
  },
  methods: {
    cardRendered: function (args) {
      const val = args.data.Priority

      addClass([args.element], val)
    },

    onDragStart(e) {
      this.updatedPosition = { ...e.data[0] }
    },

    onDragStop(e) {
      console.log(e.data)
      if (e.data.length) {
        const newStage = e.data[0].stage
        let stages = [...this.updatedPosition.current_stage]

        console.log('OLD : ', this.updatedPosition.stage)
        console.log('NEW : ', newStage)

        if (this.updatedPosition.stage !== 'Unassigned') {
          stages = this.updatedPosition.current_stage.filter((stage) => stage !== this.updatedPosition.stage)
        }

        if (newStage !== 'Unassigned') {
          const isStageExists = stages.find((stage) => stage === newStage)

          if (isStageExists) {
            const newPositions = this.positions.filter((pos) => pos._id !== this.updatedPosition._id)
            
            this.positions = [...newPositions]
          } else {
            stages.push(newStage)
          }
        }

        this.updatedPosition.current_stage = [...stages]
        this.updatedPosition.stage = newStage

        const payload = {
          project_id: this.$route.params.id,
          location_id: this.updatedPosition.locationId,
          position_id: this.updatedPosition.id,
          ...this.updatedPosition
        }

        delete payload.stage
        delete payload.locationId
        delete payload.locationName
        delete payload._id

        console.log(payload.current_stage)

        this.$store.dispatch('project/updatePosition', payload)
      }
    },

    getAllProjectLocations() {
      this.isLoading = true
      this.$store.dispatch('project/getAllProjectLocations', { id: this.$route.params.id, page: 1, size: 999999 }).then(async (resp) => {
        const locations = [...resp.locations]

        const allPositions = []

        for await (const loc of locations) {
          await this.$store.dispatch('project/getLocationPositions', { project_id: this.$route.params.id, location_id: loc.id }).then(async (resp) => {
            await resp.forEach((position) => {
              position.locationId = loc.id
              position.locationName = loc.name
              if (position.current_stage.length < 1) {
                position._id = this.generateRandomId(36)
                position.stage = 'Unassigned'
                allPositions.push(position)
              }
              else if (position.current_stage.length > 0) {
                position.current_stage.forEach((stage) => {
                  position._id = this.generateRandomId(36)
                  allPositions.push({ ...position, stage: stage })
                })
              }
            })
          })
        }

        this.positions = [...allPositions]
        console.log(this.positions)
      }).finally(() => {
        this.isLoading = false
      })
      
    },

    generateRandomId(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

      let id = ''
  
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)

        id += characters.charAt(randomIndex)
      }
  
      return id
    }
  }
})
</script>

<style>

/* .e-kanban.e-width{
  min-width: 1000px;
} */

.e-kanban th, .e-kanban td {
  width: 300px !important;
}
</style>