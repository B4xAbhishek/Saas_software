<template>
  <div class="control-section">
    <v-btn color="grey lighten-2" class="mt-2" @click="$emit('back')">
      <v-icon size="18" class="mr-1">mdi-arrow-left</v-icon> Back
    </v-btn>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          solo
          hide-details
          dense
          clearable
          placeholder="Schedule Name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="red" text>Delete</v-btn>
        <v-btn color="primary">Save</v-btn>
      </v-col>
      <v-col cols="12">
        <div>
          <div class="content-wrapper">
            <ejs-gantt
              id="resource"
              ref="gantt"  
              :data-source="data"
              :task-fields="taskFields"
              :allow-selection="true"
              :resource-fields="resourceFields"
              :edit-settings="editSettings"
              :toolbar="toolbar"
              :height="height"
              :tree-column-index="1"
              :resources="resources"
              :highlight-weekends="true"
              :columns="columns"
              :label-settings="labelSettings"
              :project-start-date="projectStartDate"
              :project-end-date="projectEndDate"
              :splitter-settings="splitterSettings"
              :show-over-allocation="true"
            >
            </ejs-gantt>
          </div>
        </div>
      </v-col>
    </v-row>
    
  </div>
</template>
<script>
import Vue from 'vue'
import { Selection, Edit, DayMarkers, Toolbar } from '@syncfusion/ej2-vue-gantt'
    
export default Vue.extend({
  data: function () {
    return {
      resourceResources: [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', resourceUnit: 50 },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', resourceUnit: 70 },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team', resourceUnit: 40 }
      ],
      data: [
        {
          TaskID: 1,
          TaskName: 'Project Initiation',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
          resources: [{ resourceId: 2, Unit: 70 }],
          subtasks: [
            { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
            { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50  },
            { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 }
          ]
        },
        {
          TaskID: 5,
          TaskName: 'Project Estimation',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
          resources: [{ resourceId: 1, Unit: 50 }],
          subtasks: [
            { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
            { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
            { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
          ]
        },
        {
          TaskID: 9,
          TaskName: 'Project Completion',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
          resources: [{ resourceId: 1, Unit: 50 }],
          subtasks: [
            { TaskID: 10, TaskName: 'Develop floor plan for completion', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
            { TaskID: 11, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
            { TaskID: 12, TaskName: 'Completion approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
          ]
        }
      ],
      taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        work: 'work',
        resourceInfo: 'resources',
        type: 'taskType'
      },
      resourceFields: {
        id: 'resourceId',
        name: 'resourceName',
        unit: 'unit'
      },
      toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
      height: '600px',
      resources: this.resourceResources,
      columns: [
        { field: 'TaskID', visible: false, width: '30' },
        { field: 'TaskName', headerText: 'Task Name', width: '180' },
        { field: 'resources', headerText: 'Resources', width: '160' },
        { field: 'work', width:'110' },
        { field: 'Duration', width: '100' },
        { field: 'taskType', headerText: 'Task Type', width: '110' }
      ],
      editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
      },
      labelSettings: {
        rightLabel: 'resources'
      },
      projectStartDate: new Date('03/28/2019'),
      projectEndDate: new Date('07/28/2019'),
      splitterSettings: {
        columnIndex: 5.1
        // position: '40%'
      }
    }
  },
  provide: {
    gantt: [Selection, DayMarkers, Toolbar, Edit]
  }
})
</script>
    
    <style scoped>
    .control-section {
      width: 100% !important;
      max-width: 100% !important;
      overflow: hidden !important;
    }
    </style>