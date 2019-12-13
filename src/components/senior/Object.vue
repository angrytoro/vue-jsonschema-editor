<template>
  <div>
    <h1>编辑源码</h1>
    <div class="jsoneditor"></div>
  </div>
</template>

<script>
import _ from 'lodash'
import JSONEditor from 'jsoneditor'
export default {
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.jsoneditor = new JSONEditor(this.$el.querySelector('jsoneditor'))
    this.jsoneditor.set(_.cloneDeep(this.schema))
  }
}
</script>
