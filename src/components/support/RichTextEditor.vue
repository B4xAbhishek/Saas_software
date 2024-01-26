<template>
  <div v-click-outside="hideEditor">
    <ejs-richtexteditor
      ref="rteObj"
      v-model="description"
      :save-interval="2"
      :toolbar-settings="toolbarSettings"
    >
    </ejs-richtexteditor>
  </div>
  
</template>

<script>
import { Toolbar, HtmlEditor } from '@syncfusion/ej2-vue-richtexteditor'
export default {
  provide: {
    richtexteditor: [Toolbar, HtmlEditor]
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      description: null,
      toolbarSettings: {
        type: 'Expand',
        items: ['Bold', 'Italic', 'Underline',
          '|',
          'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
          '|',
          'CreateLink', '|', 'ClearFormat'
        ]
      }
      //   toolbarSettings: {
      //     type: 'Expand',
      //     items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
      //       'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      //       'LowerCase', 'UpperCase', '|',
      //       'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      //       'Outdent', 'Indent', '|',
      //       'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
      //       'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
      //     ]
      //   }
    }
  },
  watch: {
    description(val) {
      this.$emit('update', val)
    },
    value(val) {
      if (val) {
        this.description = val
      }
    }
  },
  created() {
    if (this.value) {
      this.description = this.value
    }
  },
  methods: {
    hideEditor() {
      this.$emit('hide')
    }
  }
}
</script>